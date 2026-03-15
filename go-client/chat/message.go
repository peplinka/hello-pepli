package chat

import "time"

type Message struct {
    ID        int       `json:"id"`
    RoomID    string    `json:"room_id"`
    UserID    int       `json:"user_id"`
    Username  string    `json:"username"`
    Content   string    `json:"content"`
    Timestamp time.Time `json:"timestamp"`
}

type ChatRequest struct {
    RoomID  string `json:"room_id"`
    UserID  int    `json:"user_id"`
    Token   string `json:"token"`
    Content string `json:"content"`
}