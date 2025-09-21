import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      style={{
        backgroundColor: darkMode ? '#f0f0f0' : '#333',
        color: darkMode ? '#333' : '#f0f0f0',
      }}
    >
      {darkMode ? '☀️ Светлая' : '🌙 Тёмная'}
    </button>
  );
};

export default ThemeToggle;