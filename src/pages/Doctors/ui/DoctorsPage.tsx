import React from 'react';
import { useTheme } from '../../../app/providers/theme/hooks/useTheme'; // ✅ Обновленный путь


export const DoctorsPage: React.FC = () => {
  const { theme } = useTheme(); // ✅ используем theme

  return (
    <div className={theme === 'dark' ? 'dark' : 'light'}>
      <div className="container">
        <h1>👩‍⚕️ Наши врачи</h1>
        <h3>Здесь будет список врачей.</h3>
      </div>
    </div>
  );
};