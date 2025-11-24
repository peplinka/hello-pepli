// src/pages/Doctors/ui/DoctorsPage.tsx

import React, { useState } from 'react';
import { useTheme } from '../../../app/providers/theme/hooks/useTheme';

// Тип для данных врача
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  description: string;
  photo: string; // URL фото
}

export const DoctorsPage: React.FC = () => {
  const { theme } = useTheme();

  // Данные врачей
  const doctorsData: Doctor[] = [
    {
      id: 1,
      name: 'Доктор Иванова Анна Сергеевна',
      specialty: 'Терапевт',
      description: 'Более 10 лет опыта. Специализируется на диагностике и лечении заболеваний внутренних органов.',
      photo: 'https://via.placeholder.com/150x150/006b7d/ffffff?text=Доктор+Иванова',
    },
    {
      id: 2,
      name: 'Доктор Петров Сергей Алексеевич',
      specialty: 'Хирург',
      description: 'Высококвалифицированный хирург. Проводит операции широкого профиля.',
      photo: 'https://via.placeholder.com/150x150/006b7d/ffffff?text=Доктор+Петров',
    },
    {
      id: 3,
      name: 'Доктор Сидорова Мария Николаевна',
      specialty: 'Невролог',
      description: 'Специалист в области заболеваний нервной системы. Индивидуальный подход к каждому пациенту.',
      photo: 'https://via.placeholder.com/150x150/006b7d/ffffff?text=Доктор+Сидорова',
    },
  ];

  // Состояние для отслеживания выбранного врача
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Обработчик клика по карточке врача
  const handleCardClick = (doctor: Doctor) => {
    // Если кликнули на того же врача - скрываем кнопку
    if (selectedDoctor && selectedDoctor.id === doctor.id) {
      setSelectedDoctor(null);
    } else {
      setSelectedDoctor(doctor);
    }
  };

  // Обработчик клика на "Записаться"
  const handleBookClick = () => {
    if (selectedDoctor) {
      alert(`Вы выбрали запись к врачу: ${selectedDoctor.name}`);
      // Здесь можно добавить логику записи (форма, API и т.д.)
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-[2rem] font-bold mb-[20px] mt-[40px]">
        Наши Врачи
      </h2>
      <p className="mb-[40px] opacity-80">
        Познакомьтесь с нашими опытными специалистами
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {doctorsData.map((doctor) => (
          <div
            key={doctor.id}
            className={`
              doctor-card
              p-6 rounded-xl shadow-sm border
              cursor-pointer
              transition-all duration-200
              hover:shadow-md
              ${selectedDoctor?.id === doctor.id ? 'border-hospital-primary ring-1 ring-hospital-primary' : 'border-gray-300'}
              ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}
            `}
            onClick={() => handleCardClick(doctor)}
          >
            {/* Фото */}
            <img
              src={doctor.photo}
              alt={`Фото ${doctor.name}`}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />

            {/* Имя */}
            <h3 className="text-[1.5rem] font-semibold text-hospital-primary mb-2">
              {doctor.name}
            </h3>

            {/* Специальность */}
            <p className="text-hospital-dark mb-4 font-medium">
              {doctor.specialty}
            </p>

            {/* Описание */}
            <p className="text-gray-600 mb-4">
              {doctor.description}
            </p>


               {/* Кнопка "Записаться" появляется при выборе карточки */}
            {selectedDoctor?.id === doctor.id && (
              <button
                className="
                  w-full
                  py-3
                  px-4
                  bg-hospital-accent text-white
                  border-2 border-hospital-accent
                  rounded-lg
                  font-bold
                  text-lg
                  hover:bg-white
                  hover:text-hospital-accent
                  transition-colors
                  duration-300
                  shadow-md
                  hover:shadow-lg
                  mt-4
                "
                onClick={(e) => {
                  e.stopPropagation(); // Останавливаем всплытие, чтобы не срабатывал клик на карточку
                  handleBookClick();
                }}
              >
                Записаться на приём
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};