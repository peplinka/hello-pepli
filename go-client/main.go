package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "strings"
    "sync"
    "time"
    
    "clinic-auth/chat"
    "github.com/gorilla/websocket"
)

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
var chatHub *chat.Hub  // ← ← ← ОБЯЗАТЕЛЬНО!

// Модели данных
type RegisterRequest struct {
    Email    string `json:"email"`
    Password string `json:"password"`
    Name     string `json:"name"`
}

type LoginRequest struct {
    Email    string `json:"email"`
    Password string `json:"password"`
}

type User struct {
    ID    int    `json:"id"`
    Email string `json:"email"`
    Name  string `json:"name"`
}

type AuthResponse struct {
    Success bool   `json:"success"`
    Message string `json:"message"`
    Token   string `json:"token,omitempty"`
    User    *User  `json:"user,omitempty"`
}

// Хранилище пользователей
var (
    users     = make(map[int]User)
    userEmail = make(map[string]int)
    nextID    = 1
    mu        sync.RWMutex
)

// WebSocket upgrader
var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

func main() {
    // 🚀 Инициализация чата
    chatHub = chat.NewHub()
    go chatHub.Run()
    
    // Регистрация хендлеров
    http.HandleFunc("/api/register", handleRegister)
    http.HandleFunc("/api/login", handleLogin)
    http.HandleFunc("/api/health", handleHealth)
    http.HandleFunc("/api/appointments", handleAppointments)
    
    // Чат эндпоинты
    http.HandleFunc("/ws/chat", handleWebSocket)
    http.HandleFunc("/api/chat/send", chatHub.SendMessage)
    http.HandleFunc("/api/chat/messages", chatHub.GetMessages)
    
    // Fallback handler для CORS
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        enableCORS(w, r)
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        http.NotFound(w, r)
    })
    
    fmt.Println("🚀 Go сервер запущен на http://localhost:8080")
    fmt.Println("📍 Endpoints:")
    fmt.Println("   POST /api/register — Регистрация")
    fmt.Println("   POST /api/login    — Вход")
    fmt.Println("   GET  /api/health   — Проверка")
    fmt.Println("   WS   /ws/chat      — WebSocket чат")
    fmt.Println("   POST /api/chat/send — Отправка сообщения")
    
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        fmt.Printf("❌ Ошибка сервера: %v\n", err)
    }
}

// WebSocket handler
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
        return
    }

    userID := r.URL.Query().Get("user_id")
    roomID := r.URL.Query().Get("room_id")
    username := r.URL.Query().Get("username")
    
    if userID == "" || roomID == "" {
        conn.Close()
        return
    }

    client := chat.NewClient(chatHub, conn, 1, username, roomID)
    client.Hub.Register <- client  // ← Используем экспортированные поля

    go client.WritePump()   // ← Экспортированные методы
    go client.ReadPump()    // ← Экспортированные методы
}

// ========== ОСТАЛЬНЫЕ ФУНКЦИИ ==========
// (handleRegister, handleLogin, handleHealth и т.д. — без изменений)
func handleRegister(w http.ResponseWriter, r *http.Request) {
    enableCORS(w, r)
    if r.Method == "OPTIONS" { return }
    if r.Method != "POST" {
        sendError(w, "Метод не разрешён", http.StatusMethodNotAllowed)
        return
    }
    
    var req RegisterRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        sendError(w, "Неверный формат данных", http.StatusBadRequest)
        return
    }
    
    errorsChan := validateRegisterRequest(req)
    var errors []string
    for err := range errorsChan {
        if err != "" { errors = append(errors, err) }
    }
    
    if len(errors) > 0 {
        sendJSON(w, AuthResponse{Success: false, Message: strings.Join(errors, "; ")}, http.StatusBadRequest)
        return
    }
    
    mu.Lock()
    if _, exists := userEmail[req.Email]; exists {
        mu.Unlock()
        sendJSON(w, AuthResponse{Success: false, Message: "Пользователь с таким email уже существует"}, http.StatusConflict)
        return
    }
    
    user := User{ID: nextID, Email: req.Email, Name: req.Name}
    users[nextID] = user
    userEmail[req.Email] = nextID
    nextID++
    mu.Unlock()
    
    fmt.Printf("✅ Зарегистрирован: %s (ID: %d)\n", user.Email, user.ID)
    sendJSON(w, AuthResponse{Success: true, Message: "Регистрация успешна!", Token: generateToken(user.ID), User: &user}, http.StatusCreated)
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
    enableCORS(w, r)
    if r.Method == "OPTIONS" { return }
    if r.Method != "POST" {
        sendError(w, "Метод не разрешён", http.StatusMethodNotAllowed)
        return
    }
    
    var req LoginRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        sendError(w, "Неверный формат данных", http.StatusBadRequest)
        return
    }
    
    if req.Email == "" || req.Password == "" {
        sendJSON(w, AuthResponse{Success: false, Message: "Email и пароль обязательны"}, http.StatusBadRequest)
        return
    }
    
    mu.RLock()
    userID, exists := userEmail[req.Email]
    var user User
    if exists { user = users[userID] }
    mu.RUnlock()
    
    if !exists {
        sendJSON(w, AuthResponse{Success: false, Message: "Неверный email или пароль"}, http.StatusUnauthorized)
        return
    }
    
    fmt.Printf("🔐 Вход: %s (ID: %d)\n", user.Email, user.ID)
    sendJSON(w, AuthResponse{Success: true, Message: "Вход выполнен!", Token: generateToken(user.ID), User: &user}, http.StatusOK)
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
    enableCORS(w, r)
    if r.Method == "OPTIONS" { return }
    sendJSON(w, map[string]string{"status": "ok"}, http.StatusOK)
}

func validateRegisterRequest(req RegisterRequest) <-chan string {
    out := make(chan string, 3)
    var wg sync.WaitGroup
    
    wg.Add(1)
    go func() {
        defer wg.Done()
        if req.Email == "" || !strings.Contains(req.Email, "@") {
            out <- "Неверный формат email"
        } else { out <- "" }
    }()
    
    wg.Add(1)
    go func() {
        defer wg.Done()
        if len(req.Password) < 6 {
            out <- "Пароль должен быть не менее 6 символов"
        } else { out <- "" }
    }()
    
    wg.Add(1)
    go func() {
        defer wg.Done()
        if req.Name == "" {
            out <- "Имя обязательно"
        } else { out <- "" }
    }()
    
    go func() { wg.Wait(); close(out) }()
    return out
}

func enableCORS(w http.ResponseWriter, r *http.Request) {
    origin := r.Header.Get("Origin")
    if origin != "" {
        w.Header().Set("Access-Control-Allow-Origin", origin)
    } else {
        w.Header().Set("Access-Control-Allow-Origin", "*")
    }
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token, X-Requested-With")
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Access-Control-Max-Age", "86400")
    if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }
}

func generateToken(userID int) string {
    return fmt.Sprintf("token_%d_%d", userID, time.Now().Unix())
}

func sendJSON(w http.ResponseWriter, data interface{}, status int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(data)
}

func sendError(w http.ResponseWriter, msg string, status int) {
    sendJSON(w, AuthResponse{Success: false, Message: msg}, status)
}

// ========== ЗАПИСИ К ВРАЧУ ==========
type Appointment struct {
    ID         int    `json:"id"`
    UserID     int    `json:"userId"`
    UserName   string `json:"userName"`
    DoctorId   int    `json:"doctorId"`
    DoctorName string `json:"doctorName"`
    Date       string `json:"date"`
    Time       string `json:"time"`
    Status     string `json:"status"`
    CreatedAt  string `json:"createdAt"`
}

var (
    appointments      = make(map[int]Appointment)
    nextAppointmentID = 1
)

func handleAppointments(w http.ResponseWriter, r *http.Request) {
    enableCORS(w, r)
    if r.Method == "OPTIONS" { return }
    
    switch r.Method {
    case "POST":
        createAppointment(w, r)
    case "GET":
        getUserAppointments(w, r)
    default:
        sendError(w, "Метод не разрешён", http.StatusMethodNotAllowed)
    }
}

func createAppointment(w http.ResponseWriter, r *http.Request) {
    var req struct {
        UserID     int    `json:"userId"`
        DoctorId   int    `json:"doctorId"`
        DoctorName string `json:"doctorName"`
        Date       string `json:"date"`
        Time       string `json:"time"`
        Comment    string `json:"comment"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        sendError(w, "Неверный формат данных", http.StatusBadRequest)
        return
    }
    
    if req.UserID <= 0 || req.DoctorId <= 0 || req.Date == "" || req.Time == "" {
        sendJSON(w, AuthResponse{Success: false, Message: "Все обязательные поля должны быть заполнены"}, http.StatusBadRequest)
        return
    }
    
    mu.RLock()
    for _, apt := range appointments {
        if apt.DoctorId == req.DoctorId && apt.Date == req.Date && apt.Time == req.Time {
            mu.RUnlock()
            sendJSON(w, AuthResponse{Success: false, Message: fmt.Sprintf("❌ Это время уже занято! Врач %s уже записан на %s в %s", req.DoctorName, req.Date, req.Time)}, http.StatusConflict)
            return
        }
    }
    mu.RUnlock()
    
    mu.RLock()
    for _, apt := range appointments {
        if apt.UserID == req.UserID && apt.Date == req.Date && apt.Time == req.Time {
            mu.RUnlock()
            sendJSON(w, AuthResponse{Success: false, Message: fmt.Sprintf("❌ Вы уже записаны на %s в %s", req.Date, req.Time)}, http.StatusConflict)
            return
        }
    }
    mu.RUnlock()
    
    mu.Lock()
    appointment := Appointment{
        ID: nextAppointmentID, UserID: req.UserID, UserName: users[req.UserID].Name,
        DoctorId: req.DoctorId, DoctorName: req.DoctorName, Date: req.Date, Time: req.Time,
        Status: "pending", CreatedAt: time.Now().Format("2006-01-02 15:04:05"),
    }
    appointments[nextAppointmentID] = appointment
    nextAppointmentID++
    mu.Unlock()
    
    fmt.Printf("📅 Новая запись: пользователь #%d → врач %s на %s %s\n", appointment.UserID, appointment.DoctorName, appointment.Date, appointment.Time)
    sendJSON(w, map[string]interface{}{"success": true, "message": "Запись успешно создана!", "appointment": appointment}, http.StatusCreated)
}

func getUserAppointments(w http.ResponseWriter, r *http.Request) {
    userIDStr := r.URL.Query().Get("userId")
    if userIDStr == "" {
        sendError(w, "Требуется параметр userId", http.StatusBadRequest)
        return
    }
    var userID int
    fmt.Sscanf(userIDStr, "%d", &userID)
    
    mu.RLock()
    var userAppointments []Appointment
    for _, apt := range appointments {
        if apt.UserID == userID { userAppointments = append(userAppointments, apt) }
    }
    mu.RUnlock()
    
    sendJSON(w, map[string]interface{}{"success": true, "appointments": userAppointments}, http.StatusOK)
}