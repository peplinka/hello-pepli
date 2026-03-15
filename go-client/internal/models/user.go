package models

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Phone    string `json:"phone"`
}

type ValidationResult struct {
	Field   string
	IsValid bool
	Error   error
}

type AuthResponse struct {
	Success bool
	Message string
	UserID  int
}