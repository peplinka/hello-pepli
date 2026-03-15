package pipeline

import (
	"fmt"
	"clinic-auth/internal/client"
	"clinic-auth/internal/models"
)

func ProcessRegistration(req models.RegisterRequest, apiClient *client.APIClient) <-chan models.AuthResponse {
	out := make(chan models.AuthResponse, 1)
	
	go func() {
		defer close(out)
		
		// Stage 1: Fan-Out валидация
		validatorChannels := FanOutValidators(req, apiClient)
		
		// Stage 2: Fan-In сбор результатов
		validationResultsChan := FanInValidators(validatorChannels...)
		validationResults := <-validationResultsChan
		
		// Проверка валидации
		if valid, errs := AllValid(validationResults); !valid {
			out <- models.AuthResponse{
				Success: false,
				Message: fmt.Sprintf("Validation failed: %v", errs),
			}
			return
		}
		
		// Stage 3: Регистрация через API
		userID, err := apiClient.RegisterUser(req)
		if err != nil {
			out <- models.AuthResponse{
				Success: false,
				Message: fmt.Sprintf("Registration failed: %v", err),
			}
			return
		}
		
		out <- models.AuthResponse{
			Success: true,
			Message: fmt.Sprintf("Welcome, %s! Your patient ID: #%d", req.Name, userID),
			UserID:  userID,
		}
	}()
	
	return out
}