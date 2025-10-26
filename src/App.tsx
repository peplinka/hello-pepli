import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeSwitch } from './components/theme-switch/ThemeSwitch'; // ✅ named import
import { useTheme } from './providers/theme/hooks/useTheme';
import { ThemeProvider } from './providers/theme/provider/Theme.provider';
import './App.css';

function HomePage() {
  const { theme } = useTheme(); // ✅ нет darkMode — есть theme

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => { // ✅ типизируем e
    e.preventDefault();
    alert(`Вы ищете: ${searchQuery}`);
  };

  return (
    <div className={theme === 'dark' ? 'dark' : 'light'}> {/* ✅ используем theme */}
      <div className="container">
        <header>
          <h1>🏥 Городская поликлиника №8</h1>
          <h3>Заботимся о вашем здоровье с 1985 года</h3>

          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Найти врача, услугу или анализ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">🔍</button>
          </form>
        </header>

        <section className="info-section">
          <h2>О нас</h2>
          <p>
            Мы — многопрофильная поликлиника, оказывающая высококачественные медицинские услуги взрослым и детям.
            Современное оборудование, опытные врачи, комфортные условия.
          </p>
        </section>

        <section className="location-section">
          <h2>📍 Наш адрес</h2>
          <p><strong>ул. Правды, 13А, посёлок Дербышки, Советский район, Казань</strong></p>
          <div className="map-container">
            <iframe
              title="Карта поликлиники"
              src="https://yandex.ru/maps/-/CLBHqPZc"
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        <section className="news-section">
          <h2>📰 Последние записи</h2>
          <ul>
            <li className="record-item">
              <span className="record-icon">📅</span>
              12.04.2025 — Вакцинация от гриппа доступна для всех возрастов
            </li>
            <li className="record-item">
              <span className="record-icon">🩺</span>
              10.04.2025 — Приём врача-невролога по субботам
            </li>
            <li className="record-item">
              <span className="record-icon">🏥</span>
              05.04.2025 — Новый рентген-кабинет открыт в корпусе Б
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function Doctors() {
  return (
    <div className="container">
      <h1>👩‍⚕️ Наши врачи</h1>
      <h3>Здесь будет список врачей.</h3>
    </div>
  );
}

function Services() {
  return (
    <div className="container">
      <h1>🩺 Услуги</h1>
      <h3>Здесь будет список медицинских услуг.</h3>
    </div>
  );
}

function Contacts() {
  return (
    <div className="container">
      <h1>📞 Контакты</h1>
      <h3>Адрес: ул. Правды, 13А, посёлок Дербышки, Советский район, Казань</h3>
      <h3>Телефон: +7 (495) 123-45-67</h3>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider> {/* ✅ теперь работает */}
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
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contacts" element={<Contacts />} />
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;