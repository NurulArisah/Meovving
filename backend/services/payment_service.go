// /services/payment_service.go

package services

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/xendit/xendit-go/v6"
	"github.com/xendit/xendit-go/v6/invoice"
)

type PaymentService interface {
	CreateXenditInvoice(ctx context.Context, userID, packageName string, amount int64) (string, string, error)
}

type paymentService struct {
	xenditClient *xendit.APIClient
}

// Helper function untuk menangani pointer string (PENTING!)
func stringPtr(s string) *string {
	return &s
}

func NewPaymentService() PaymentService {
	apiKey := strings.TrimSpace(os.Getenv("XENDIT_SECRET_KEY"))
	client := xendit.NewClient(apiKey)

	fmt.Println("Payment Service initialized with Xendit SDK")

	return &paymentService{
		xenditClient: client,
	}
}

func (s *paymentService) CreateXenditInvoice(ctx context.Context, userID, packageName string, amount int64) (string, string, error) {
    externalID := fmt.Sprintf("%s-%d", userID, time.Now().Unix())

    var maxProfiles int
    switch packageName {
    case "Family": maxProfiles = 5
    case "Duo":    maxProfiles = 2
    default:       maxProfiles = 1
    }

    // Metadata harus dipastikan tidak nil dan sesuai format yang didukung
    metadata := map[string]interface{}{
        "user_uid":     userID,
        "package_name": packageName,
        "max_profiles": maxProfiles,
    }

    createInvoiceRequest := invoice.CreateInvoiceRequest{
        ExternalId:  externalID,
        Amount:      float64(amount),
        Description: stringPtr(fmt.Sprintf("Subscription Package: %s", packageName)),
        Metadata:    metadata, // Pastikan dipassing langsung ke field Metadata
        SuccessRedirectUrl: stringPtr("http://127.0.0.1:5500/frontend/public/success-payment.html"),
    }

    // DEBUG: Pastikan data sebelum dikirim sudah benar
    fmt.Printf("DEBUG Sending to Xendit - UID: %s, Pkg: %s\n", userID, packageName)

    resp, _, err := s.xenditClient.InvoiceApi.CreateInvoice(ctx).
        CreateInvoiceRequest(createInvoiceRequest).
        Execute()

    if err != nil {
        return "", "", fmt.Errorf("xendit api error: %v", err)
    }

    return resp.InvoiceUrl, externalID, nil
}