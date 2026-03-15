package chat

import (
    "log"
    "time"
    "github.com/gorilla/websocket"
)

type Client struct {
    Hub      *Hub             // ← Большая буква!
    Conn     *websocket.Conn  // ← Большая буква!
    Send     chan []byte      // ← Большая буква!
    UserID   int
    Username string
    RoomID   string
}

func NewClient(hub *Hub, conn *websocket.Conn, userID int, username, roomID string) *Client {
    return &Client{
        Hub:      hub,
        Conn:     conn,
        Send:     make(chan []byte, 256),
        UserID:   userID,
        Username: username,
        RoomID:   roomID,
    }
}

func (c *Client) ReadPump() {  // ← Большая буква!
    defer func() {
        c.Hub.Unregister <- c
        c.Conn.Close()
    }()

    for {
        _, message, err := c.Conn.ReadMessage()
        if err != nil {
            if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
                log.Printf("error: %v", err)
            }
            break
        }
        
        msg := Message{
            RoomID:    c.RoomID,
            UserID:    c.UserID,
            Username:  c.Username,
            Content:   string(message),
            Timestamp: time.Now(),
        }
        
        c.Hub.Broadcast <- msg
    }
}

func (c *Client) WritePump() {  // ← Большая буква!
    defer func() {
        c.Conn.Close()
    }()

    for {
        select {
        case message, ok := <-c.Send:
            if !ok {
                c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
                return
            }
            c.Conn.WriteMessage(websocket.TextMessage, message)
        }
    }
}