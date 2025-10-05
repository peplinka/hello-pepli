import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import './App.css';


function HomePage() {
   const { darkMode } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Вы ищете: ${searchQuery}`);
  };

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      {/* Убираем ThemeToggle отсюда — он будет в меню */}
      <div className="container">
        <header>
          <h1>🏥 Городская поликлиника №8</h1>
          <p>Заботимся о вашем здоровье с 1985 года</p>
           {/* 🔍 ПОЛЕ ПОИСКА — ДОБАВЬ ЭТО СЮДА */}
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

// 👇 Заглушки для других страниц (можно создать позже как отдельные файлы)
function Doctors() {
  return (
    <div className="container">
      <h1>👩‍⚕️ Наши врачи</h1>
      <p>Здесь будет список врачей.</p>
    </div>
  );
}

function Services() {
  return (
    <div className="container">
      <h1>🩺 Услуги</h1>
      <p>Здесь будет список медицинских услуг.</p>
    </div>
  );
}

function Contacts() {
  return (
    <div className="container">
      <h1>📞 Контакты</h1>
      <p>Адрес: ул. Правды, 13А, посёлок Дербышки, Советский район, Казань</p>
      <p>Телефон: +7 (495) 123-45-67</p>
    </div>
  );
}

// 👇 Главный компонент App — теперь он управляет навигацией
function App() {
  const { darkMode } = useTheme();

  return (
    <BrowserRouter>
      <div className={darkMode ? 'dark' : 'light'}>
        {/* Навигация */}
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/doctors">Врачи</Link></li>
            <li><Link to="/services">Услуги</Link></li>
            <li><Link to="/contacts">Контакты</Link></li>
          </ul>
          <ThemeToggle />
        </nav>

        {/* Контент страниц */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contacts" element={<Contacts />} />
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;