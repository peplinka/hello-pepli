import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ← ← ← Добавьте эту строку
import './AuthForm.css';

type AuthMode = 'login' | 'register';

interface UserData {
  id: number;
  email: string;
  name: string;
}

export const AuthForm: React.FC = () => {
  const navigate = useNavigate();  // ← ← ← Добавьте эту строку
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const endpoint = mode === 'login' ? '/api/login' : '/api/register';
  const payload = mode === 'login' 
    ? { email, password }
    : { email, password, name };

  try {
    const response = await fetch(`http://localhost:8080${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Произошла ошибка');
    }

    if (data.user) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      // ✅ Редирект на главную после входа
      navigate('/', { replace: true });
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Ошибка подключения к серверу');
  } finally {
    setLoading(false);
  }
};

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setUser(null);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (user) {
    return (
      <div className="auth-container">
        <div className="auth-card success">
          <h2>🎉 Добро пожаловать!</h2>
          <p><strong>Имя:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id}</p>
          <button onClick={handleLogout} className="logout-btn">
            Выйти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{mode === 'login' ? '🔐 Вход' : '📝 Регистрация'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите ваше имя"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Загрузка...' : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>
        
        <div className="toggle-mode">
          {mode === 'login' ? (
            <p>
              Нет аккаунта? <button onClick={toggleMode}>Зарегистрироваться</button>
            </p>
          ) : (
            <p>
              Уже есть аккаунт? <button onClick={toggleMode}>Войти</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};