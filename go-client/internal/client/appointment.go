package client

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
    "go-client/internal/models"
)

const APIBase = "https://jsonplaceholder.typicode.com"

func BookAppointment(doctorID int, timeSlot string) (*models.Appointment, error) {
    // Имитация записи (POST запрос)
    payload := map[string]interface{}{
        "userId": doctorID,
        "title":  timeSlot,
        "body":   "Пациент: Иванов И.И.",
    }
    
    jsonData, err := json.Marshal(payload)
    if err != nil {
        return nil, err
    }

    resp, err := http.Post(APIBase+"/posts", "application/json", bytes.NewBuffer(jsonData))
    if err != nil {
        return nil, fmt.Errorf("network error: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != 201 {
        return nil, models.BookingError{Code: resp.StatusCode, Msg: "slot unavailable"}
    }

    var appointment models.Appointment
    if err := json.NewDecoder(resp.Body).Decode(&appointment); err != nil {
        return nil, err
    }

    appointment.Status = "confirmed"
    return &appointment, nil
}