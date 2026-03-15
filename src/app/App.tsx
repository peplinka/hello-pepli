// src/app/App.tsx

import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "../shared/ui/providers/theme/provider/Theme.provider";
import { ThemeSwitch } from "../shared/ui/theme-switch/ThemeSwitch";
import { useTheme } from "../shared/ui/providers/theme/hooks/useTheme";

import { MainPage } from "../pages/Main";
import { DoctorsPage } from "../pages/Doctors";
import { ServicesPage } from "../pages/Services";
import { ContactsPage } from "../pages/Contacts";
import { AuthPage } from "../pages/Auth";

// 🔐 Компонент защиты маршрутов (внутри файла для простоты)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Сохраняем путь, куда хотел попасть пользователь
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { theme } = useTheme();
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <ThemeProvider>
        <div
          className={`${theme === "dark" ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
        >
          <div
            className="min-h-screen flex flex-col items-center bg-repeat-x bg-center bg-cover"
            style={{
              backgroundImage: "url(https://example.com/your-background-pattern.png)",
            }}
          >
            <div className="w-full max-w-[1080px] mx-auto px-4 py-8">
              
              {/* 🔐 Навигация — показываем ТОЛЬКО авторизованным */}
              {isAuthenticated && (
                <nav className="main-nav flex justify-between items-center py-[15px] px-[20px] bg-hospital-secondary shadow-md rounded-lg mb-[20px]">
                  <ul className="flex gap-[24px] m-0 p-0 list-none">
                    <li>
                      <Link to="/" className="no-underline text-hospital-dark font-semibold py-[8px] px-[12px] rounded-[6px] transition-all duration-200 hover:bg-hospital-primary hover:text-white">
                        Главная
                      </Link>
                    </li>
                    <li>
                      <Link to="/doctors" className="no-underline text-hospital-dark font-semibold py-[8px] px-[12px] rounded-[6px] transition-all duration-200 hover:bg-hospital-primary hover:text-white">
                        Врачи
                      </Link>
                    </li>
                    <li>
                      <Link to="/services" className="no-underline text-hospital-dark font-semibold py-[8px] px-[12px] rounded-[6px] transition-all duration-200 hover:bg-hospital-primary hover:text-white">
                        Услуги
                      </Link>
                    </li>
                    <li>
                      <Link to="/contacts" className="no-underline text-hospital-dark font-semibold py-[8px] px-[12px] rounded-[6px] transition-all duration-200 hover:bg-hospital-primary hover:text-white">
                        Контакты
                      </Link>
                    </li>
                  </ul>
                  
                  <div className="flex items-center gap-4">
                    {/* 👤 Имя пользователя + кнопка Выйти */}
                    {isAuthenticated && (
                      <>
                        <span className="text-hospital-dark font-medium text-sm">
                          👤 {JSON.parse(localStorage.getItem("user") || "{}")?.name || "Пользователь"}
                        </span>
                        <button
                          onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            window.location.href = "/auth";
                          }}
                          className="no-underline text-red-600 font-semibold py-[8px] px-[12px] rounded-[6px] hover:bg-red-100 transition-all"
                        >
                          Выйти
                        </button>
                      </>
                    )}
                    <ThemeSwitch />
                  </div>
                </nav>
              )}

              <div className="container mx-auto px-5 py-10">
                <Routes>
                  {/* 🔓 Публичный маршрут — авторизация */}
                  <Route path="/auth" element={<AuthPage />} />

                  {/* 🔐 Защищённые маршруты */}
                  <Route path="/" element={
                    <ProtectedRoute><MainPage /></ProtectedRoute>
                  } />
                  <Route path="/doctors" element={
                    <ProtectedRoute><DoctorsPage /></ProtectedRoute>
                  } />
                  <Route path="/services" element={
                    <ProtectedRoute><ServicesPage /></ProtectedRoute>
                  } />
                  <Route path="/contacts" element={
                    <ProtectedRoute><ContactsPage /></ProtectedRoute>
                  } />

                  {/* 🔁 Редирект неизвестных путей на авторизацию */}
                  <Route path="*" element={<Navigate to="/auth" replace />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;