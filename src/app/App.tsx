import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './providers/theme/provider/Theme.provider'; // Путь к провайдеру
import { ThemeSwitch } from '../shared/ui/theme-switch/ThemeSwitch'; // Путь к компоненту
import { useTheme } from './providers/theme/hooks/useTheme'; // 
// или
// import { useTheme } from './providers/theme/hooks/useTheme'; // если он в app/providers

// ✅ Импортируем страницы из новых папок
import { MainPage } from '../pages/Main';
import { DoctorsPage } from '../pages/Doctors'; // ✅ Импорт через index.ts
import { ServicesPage } from '../pages/Services';
import { ContactsPage } from '../pages/Contacts';

import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className={useTheme().theme === 'dark' ? 'dark' : 'light'}>
          <nav className="main-nav">
            <ul>
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/doctors">Врачи</Link></li>
              <li><Link to="/services">Услуги</Link></li>
              <li><Link to="/contacts">Контакты</Link></li>
            </ul>
            <ThemeSwitch />
          </nav>

          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;