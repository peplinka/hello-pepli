// src/app/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './providers/theme/provider/Theme.provider';
import { ThemeSwitch } from '../shared/ui/theme-switch/ThemeSwitch';
import { useTheme } from './providers/theme/hooks/useTheme';

import { MainPage } from '../pages/Main';
import { DoctorsPage } from '../pages/Doctors';
import { ServicesPage } from '../pages/Services';
import { ContactsPage } from '../pages/Contacts';

const App: React.FC = () => {
  const { theme } = useTheme();

  return (
    <BrowserRouter>
      <ThemeProvider>
        {/* Этот div задаёт тему (светлая/тёмная) */}
        <div className={`${theme === 'dark' ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
          {/* Этот div ограничивает ширину и центрирует ВЕСЬ КОНТЕНТ */}
          <div className="min-h-screen flex flex-col items-center bg-repeat-x bg-center bg-cover"
               style={{ backgroundImage: 'url(https://example.com/your-background-pattern.png)' /* или уберите, если не нужно */ }}>
            <div className="w-full max-w-[1080px] mx-auto px-4 py-8"> {/* ✅ Центральный контейнер */}
              <nav className="
                main-nav
                flex justify-between items-center py-[15px] px-[20px] bg-hospital-secondary shadow-md rounded-lg mb-[20px]
              ">
                <ul className="flex gap-[24px] m-0 p-0 list-none">
                  <li>
                    <Link
                      to="/"
                      className="
                        no-underline text-hospital-dark font-semibold py-[8px] px-[12px] rounded-[6px]
                        transition-all duration-200 hover:bg-hospital-primary hover:text-white
                      "
                    >
                      Главная
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/doctors"
                      className="
                        no-underline text-hospital-dark font-semibold py-[8px] px-[12px] rounded-[6px]
                        transition-all duration-200 hover:bg-hospital-primary hover:text-white
                      "
                    >
                      Врачи
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services"
                      className="
                        no-underline text-hospital-dark font-semibold py-[8px] px-[12px] rounded-[6px]
                        transition-all duration-200 hover:bg-hospital-primary hover:text-white
                      "
                    >
                      Услуги
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contacts"
                      className="
                        no-underline text-hospital-dark font-semibold py-[8px] px-[12px] rounded-[6px]
                        transition-all duration-200 hover:bg-hospital-primary hover:text-white
                      "
                    >
                      Контакты
                    </Link>
                  </li>
                </ul>
                <ThemeSwitch />
              </nav>

              {/* Этот div заменяет ваш .container из предыдущих версий */}
              <div className="container mx-auto px-5 py-10">
                <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/doctors" element={<DoctorsPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;