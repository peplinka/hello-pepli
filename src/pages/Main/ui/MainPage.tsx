import React, { useState } from 'react';
import { useTheme } from '@/shared/ui/providers/theme/hooks/useTheme';
import { ThemeSwitch } from '@/shared/ui/theme-switch/ThemeSwitch';

export const MainPage: React.FC = () => {
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Вы ищете: ${searchQuery}`);
  };

  return (
    <div className={theme === 'dark' ? 'dark' : 'light'}>
      <div className="container"> {/* ✅ Стиль через @apply */}
        <header>
          <h1>🏥 Городская поликлиника №8</h1>
          <h3>Заботимся о вашем здоровье с 1985 года</h3>
          <form onSubmit={handleSearch} className="search-form"> {/* ✅ Стиль через @apply */}
            <input
              type="text"
              placeholder="Найти врача, услугу или анализ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input" 
            />
            <button type="submit" className="search-button">🔍</button> {/* ✅ Стиль через @apply */}
          </form>
        </header>

        <section className="info-section"> {/* ✅ Стиль через @apply */}
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
              title="Карта поликлиники на Яндекс.Картах"
              // Замените этот src на тот, что вы получите из конструктора
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A...ваш_уникальный_код..." 
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen={true}
            ></iframe>
          </div>
        </section>
        <section className="news-section"> {/* ✅ Стиль через @apply */}
          <h2>📰 Последние записи</h2>
          <ul>
            <li className="record-item"> {/* ✅ Стиль через @apply */}
              <span className="record-icon">📅</span> {/* ✅ Стиль через @apply */}
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