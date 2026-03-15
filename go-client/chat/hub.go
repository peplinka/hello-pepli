package chat

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "sync"
    "time"
)

type Hub struct {
    Clients     map[*Client]bool
    RoomClients map[string]map[*Client]bool
    Broadcast   chan Message
    Register    chan *Client
    Unregister  chan *Client
    mu          sync.RWMutex
    MessageID   int
}

func NewHub() *Hub {
    return &Hub{
        Clients:     make(map[*Client]bool),           // ← Capitalized!
        RoomClients: make(map[string]map[*Client]bool), // ← Capitalized!
        Broadcast:   make(chan Message),                // ← Capitalized!
        Register:    make(chan *Client),                // ← Capitalized!
        Unregister:  make(chan *Client),                // ← Capitalized!
    }
}

func (h *Hub) Run() {
    for {
        select {
        case client := <-h.Register:  // ← Capitalized!
            h.mu.Lock()
            if _, ok := h.RoomClients[client.RoomID]; !ok {  // ← Capitalized!
                h.RoomClients[client.RoomID] = make(map[*Client]bool)
            }
            h.RoomClients[client.RoomID][client] = true
            h.Clients[client] = true  // ← Capitalized!
            h.mu.Unlock()
            
            log.Printf("🟢 %s подключился к %s", client.Username, client.RoomID)

        case client := <-h.Unregister:  // ← Capitalized!
            h.mu.Lock()
            if _, ok := h.RoomClients[client.RoomID]; ok {
                delete(h.RoomClients[client.RoomID], client)
                close(client.Send)  // ← Capitalized!
                delete(h.Clients, client)
            }
            h.mu.Unlock()
            
            log.Printf("🔴 %s отключился от %s", client.Username, client.RoomID)

        case message := <-h.Broadcast:  // ← Capitalized!
            h.mu.RLock()
            message.ID = h.MessageID
            h.MessageID++
            h.mu.RUnlock()
            
            h.mu.RLock()
            if clients, ok := h.RoomClients[message.RoomID]; ok {
                messageJSON, _ := json.Marshal(message)
                for client := range clients {
                    select {
                    case client.Send <- messageJSON:  // ← Capitalized!
                    default:
                        close(client.Send)
                        delete(h.Clients, client)
                    }
                }
            }
            h.mu.RUnlock()
            
            log.Printf("💬 [%s] %s: %s", message.RoomID, message.Username, message.Content)
        }
    }
}

func (h *Hub) SendMessage(w http.ResponseWriter, r *http.Request) {
    if r.Method != "POST" {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    var req ChatRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    if req.Token == "" || req.UserID <= 0 {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    msg := Message{
        RoomID:    req.RoomID,
        UserID:    req.UserID,
        Username:  fmt.Sprintf("User_%d", req.UserID),
        Content:   req.Content,
        Timestamp: time.Now(),
    }

    h.Broadcast <- msg  // ← Capitalized!

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "success": true,
        "message": msg,
    })
}

func (h *Hub) GetMessages(w http.ResponseWriter, r *http.Request) {
    roomID := r.URL.Query().Get("room_id")
    if roomID == "" {
        http.Error(w, "room_id required", http.StatusBadRequest)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "room_id":  roomID,
        "messages": []Message{},
    })
}