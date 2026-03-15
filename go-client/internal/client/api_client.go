package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"clinic-auth/internal/models"
)

type APIClient struct {
	baseURL string
	client  *http.Client
}

func NewAPIClient(baseURL string) *APIClient {
	return &APIClient{
		baseURL: baseURL,
		client:  &http.Client{},
	}
}

// Проверка, существует ли пользователь с таким email
func (c *APIClient) CheckUserExists(email string) (bool, error) {
	resp, err := c.client.Get(fmt.Sprintf("%s/users?email=%s", c.baseURL, email))
	if err != nil {
		return false, fmt.Errorf("API request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return false, fmt.Errorf("read response failed: %w", err)
	}

	var users []map[string]interface{}
	if err := json.Unmarshal(body, &users); err != nil {
		return false, fmt.Errorf("unmarshal failed: %w", err)
	}

	return len(users) > 0, nil
}

// Регистрация пользователя (симуляция)
func (c *APIClient) RegisterUser(req models.RegisterRequest) (int, error) {
	// В реальном проекте: POST /users
	// Для лабы: возвращаем фиктивный ID
	return 1001, nil
}