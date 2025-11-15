import React, { useState } from 'react';
import { useTheme } from '../../../app/providers/theme/hooks/useTheme'; // ✅ Обновленный путь к хуку
import { ThemeSwitch } from '../../../shared/ui/theme-switch/ThemeSwitch'; // ✅ Обновленный путь к компоненту


export const MainPage: React.FC = () => {
  const { theme } = useTheme(); // ✅ используем theme

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Вы ищете: ${searchQuery}`);
  };

  return (
    <div className={theme === 'dark' ? 'dark' : 'light'}>
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
};