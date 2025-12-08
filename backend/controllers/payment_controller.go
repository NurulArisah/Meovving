package controllers

import (
	"context"
	"log"
	"net/http"
	// "time"
	// "fmt"

	"meovving-project-web-fiks/config"
	"meovving-project-web-fiks/services"

	"github.com/gin-gonic/gin"
)

type PaymentController struct {
	PService services.PaymentService
	AService services.AuthService 
	Config   *config.EnvConfig
}

func NewPaymentController(p services.PaymentService, a services.AuthService, cfg *config.EnvConfig) *PaymentController {
	return &PaymentController{
		PService: p,
		AService: a,
		Config:   cfg,
	}
}

// Struct request dari Frontend
type CheckoutRequest struct {
	PackageName string  `json:"package_name" binding:"required"`
	Amount      int64 `json:"amount" binding:"required"` 
}

// Helper function untuk validasi harga (SECURITY)
func getExpectedAmount(packageName string) int64 {
	switch packageName {
	case "Family":
		return 49900
	case "Duo":
		return 29900
	case "Individual":
		return 19900
	default:
		return 0
	}
}

// CheckoutHandler: POST /api/v1/premium/payment/checkout
func (ctrl *PaymentController) CheckoutHandler(c *gin.Context) {
	userID, exists := c.Get("user_uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User tidak terautentikasi"})
		return
	}
	
	var req CheckoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format request tidak valid", "details": err.Error()})
		return
	}
	
	// CEK KEAMANAN
	expectedAmount := getExpectedAmount(req.PackageName) 
	if req.Amount != expectedAmount {
		c.JSON(http.StatusForbidden, gin.H{"error": "Jumlah pembayaran tidak sesuai"})
		return
	}

	// PANGGIL SERVICE XENDIT (Fungsi yang sudah diperbarui di Service)
	redirectURL, externalID, err := ctrl.PService.CreateXenditInvoice(c.Request.Context(), userID.(string), req.PackageName, req.Amount)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memulai transaksi Xendit", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "transaction created",
		"external_id":  externalID,
		"payment_url":  redirectURL,
	})
}

// XenditWebhookHandler: POST /api/v1/payment/notification (Dipanggil oleh Xendit)
func (ctrl *PaymentController) XenditWebhookHandler(c *gin.Context) {

	callbackToken := c.GetHeader("x-callback-token")
    if callbackToken != ctrl.Config.XenditCallbackToken { 
        log.Printf("Peringatan: Upaya akses ilegal ke Webhook dari IP: %s", c.ClientIP())
        c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized webhook"})
        return
    }

    // Definisi struct harus match dengan format Xendit (metadata lowercase)
    var notification struct {
        ID         string                 `json:"id"`
        ExternalID string                 `json:"external_id"`
        Status     string                 `json:"status"`
        Metadata   map[string]interface{} `json:"metadata"`
    }

    // BACA SEKALI SAJA (Hapus log raw debug yang tadi untuk menghindari EOF)
    if err := c.ShouldBindJSON(&notification); err != nil {
        log.Printf("Error binding notifikasi Xendit: %v", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"}) 
        return
    }

    log.Printf("Menerima notifikasi - ID: %s, Status: %s, Metadata: %+v", 
        notification.ExternalID, notification.Status, notification.Metadata)

    if notification.Status == "PAID" || notification.Status == "SETTLED" {
        var userID, packageName string

        // Ambil data metadata dengan aman
        if notification.Metadata != nil {
            if val, ok := notification.Metadata["user_uid"].(string); ok {
                userID = val
            }
            if val, ok := notification.Metadata["package_name"].(string); ok {
                packageName = val
            }
        }

        // Jalankan logika aktivasi (UpdateUserPackage) jika userID & packageName ada
        if userID != "" && packageName != "" {
            err := ctrl.AService.UpdateUserPackage(context.Background(), userID, packageName)
            if err != nil {
                log.Printf("DB Update Gagal: %v", err)
            }
        }
    }

    c.JSON(http.StatusOK, gin.H{"status": "success"})
}