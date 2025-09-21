import React from 'react';
import { useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import './App.css';


function App() {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <ThemeToggle />

      <div className="container">
        <header>
          <h1>🏥 Городская поликлиника №1</h1>
          <p>Заботимся о вашем здоровье с 1985 года</p>
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
          <p><strong>г. Москва, ул. Ленина, д. 15</strong></p>
          <div className="map-placeholder">
            {/* Здесь позже можно вставить карту (например, Яндекс.Карты или Google Maps) */}
            <p>🗺️ Интерактивная карта будет здесь</p>
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

export default App;