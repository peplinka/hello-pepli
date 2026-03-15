package pipeline

import (
	"net/mail"
	"regexp"
	"strings"
	"clinic-auth/internal/client"
	"clinic-auth/internal/models"
)

type Validator func(models.RegisterRequest) <-chan models.ValidationResult

// Валидатор email формата
func ValidateEmail(req models.RegisterRequest) <-chan models.ValidationResult {
	out := make(chan models.ValidationResult, 1)
	go func() {
		defer close(out)
		_, err := mail.ParseAddress(req.Email)
		out <- models.ValidationResult{
			Field:   "email",
			IsValid: err == nil && strings.Contains(req.Email, "@"),
			Error:   err,
		}
	}()
	return out
}

// Валидатор пароля
func ValidatePassword(req models.RegisterRequest) <-chan models.ValidationResult {
	out := make(chan models.ValidationResult, 1)
	go func() {
		defer close(out)
		valid := len(req.Password) >= 8 &&
			regexp.MustCompile(`[A-Z]`).MatchString(req.Password) &&
			regexp.MustCompile(`[0-9]`).MatchString(req.Password)
		
		var err error
		if !valid {
			err = fmt.Errorf("password must be 8+ chars with uppercase and digit")
		}
		out <- models.ValidationResult{
			Field:   "password",
			IsValid: valid,
			Error:   err,
		}
	}()
	return out
}

// Валидатор обязательных полей
func ValidateRequired(req models.RegisterRequest) <-chan models.ValidationResult {
	out := make(chan models.ValidationResult, 1)
	go func() {
		defer close(out)
		valid := req.Name != "" && req.Email != "" && req.Phone != ""
		var err error
		if !valid {
			err = fmt.Errorf("name, email and phone are required")
		}
		out <- models.ValidationResult{
			Field:   "required_fields",
			IsValid: valid,
			Error:   err,
		}
	}()
	return out
}

// Валидатор через API (проверка уникальности email)
func ValidateAPIUnique(client *client.APIClient, req models.RegisterRequest) <-chan models.ValidationResult {
	out := make(chan models.ValidationResult, 1)
	go func() {
		defer close(out)
		exists, err := client.CheckUserExists(req.Email)
		out <- models.ValidationResult{
			Field:   "email_unique",
			IsValid: !exists && err == nil,
			Error:   err,
		}
	}()
	return out
}

// Fan-Out: запуск всех валидаторов параллельно
func FanOutValidators(req models.RegisterRequest, apiClient *client.APIClient) []<-chan models.ValidationResult {
	return []<-chan models.ValidationResult{
		ValidateEmail(req),
		ValidatePassword(req),
		ValidateRequired(req),
		ValidateAPIUnique(apiClient, req),
	}
}