import React from 'react';
import { useTheme } from '../../../app/providers/theme/hooks/useTheme'; // ✅ Обновленный путь


export const ServicesPage: React.FC = () => {
  const { theme } = useTheme(); // ✅ используем theme

  return (
    <div className={theme === 'dark' ? 'dark' : 'light'}>
      <div className="container">
        <h1>🩺 Услуги</h1>
        <h3>Здесь будет список медицинских услуг.</h3>
      </div>
    </div>
  );
};