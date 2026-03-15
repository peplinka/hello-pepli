import React from "react";
import { AuthForm } from "../features/auth/AuthForm";

export const AuthPage: React.FC = () => {
  return (
    <div className="auth-page-wrapper">
      <AuthForm />
    </div>
  );
};