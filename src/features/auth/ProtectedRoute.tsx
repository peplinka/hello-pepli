import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // Если нет токена или пользователя — редирект на авторизацию
  if (!token || !user) {
    // Сохраняем текущий путь, чтобы вернуться после входа
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Если авторизован — показываем контент
  return <>{children}</>;
};