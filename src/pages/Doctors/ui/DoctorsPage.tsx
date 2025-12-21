// src/pages/Doctors/ui/DoctorsPage.tsx

import React, { useState } from "react";
import { useTheme } from "@/shared/ui/providers/theme/hooks/useTheme";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { BookingModal } from "@/features/doctors/appointment/ui/BookingModal";

import drIvanova from "@/shared/doctor/assets/images/doctor_IvanovaAnna.jpg";
import drPetrov from "@/shared/doctor/assets/images/doctor_PetrovSergey.jpg";
import drSidorova from "@/shared/doctor/assets/images/doctor_SidorovaMariya.avif";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  description: string;
  photo: string;
}

export const DoctorsPage: React.FC = () => {
  const { theme } = useTheme();

  const doctorsData: Doctor[] = [
    {
      id: 1,
      name: "Доктор Иванова Анна Сергеевна",
      specialty: "Терапевт",
      description:
        "Более 10 лет опыта. Специализируется на диагностике и лечении заболеваний внутренних органов.",
      photo: drIvanova,
    },
    {
      id: 2,
      name: "Доктор Петров Сергей Алексеевич",
      specialty: "Хирург",
      description:
        "Высококвалифицированный хирург. Проводит операции широкого профиля.",
      photo: drPetrov,
    },
    {
      id: 3,
      name: "Доктор Сидорова Мария Николаевна",
      specialty: "Невролог",
      description:
        "Специалист в области заболеваний нервной системы. Индивидуальный подход к каждому пациенту.",
      photo: drSidorova,
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleCardClick = (doctor: Doctor) => {
    setSelectedDoctor((prev) => (prev?.id === doctor.id ? null : doctor));
  };

  const openBookingModal = () => {
    if (selectedDoctor) {
      setIsModalOpen(true);
    }
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmBooking = (date: Date, time: string) => {
    alert(
      `Запись к ${selectedDoctor?.name} на ${date.toLocaleDateString("ru-RU")} в ${time}`,
    );
    closeBookingModal();
  };

  return (
    <div className="text-center px-4 py-6">
      <p className="text-[2rem] font-bold mb-5 mt-10">Наши Врачи</p>
      <p className="text-[2rem] font-bold mb-5 mt-5">
        Познакомьтесь с нашими опытными специалистами
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {doctorsData.map((doctor) => (
          <div
            key={doctor.id}
            className={`
              p-6 rounded-xl shadow-sm border cursor-pointer
              transition-all duration-200 hover:shadow-md
              ${
                selectedDoctor?.id === doctor.id
                  ? "border-hospital-primary ring-1 ring-hospital-primary"
                  : "border-gray-300"
              }
              ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white text-hospital-dark"
              }
            `}
            onClick={() => handleCardClick(doctor)}
          >
            {/* Фото */}
            <div className="flex justify-center mb-4">
              <img
                src={doctor.photo}
                alt={`Фото ${doctor.name}`}
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>

            <h3 className="text-[1.5rem] font-semibold text-hospital-primary mb-2">
              {doctor.name}
            </h3>
            <p className="font-medium mb-3">{doctor.specialty}</p>
            <p className="opacity-80 mb-4">{doctor.description}</p>

            {/* Кнопка "Записаться" */}
            {selectedDoctor?.id === doctor.id && (
              <button
                className={`
                  w-full py-3 px-4 rounded-lg font-bold text-lg
                  border-2 border-hospital-primary text-hospital-primary
                  bg-transparent
                  hover:bg-hospital-primary hover:text-white
                  transition-colors duration-300
                  shadow-sm hover:shadow-md mt-2
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  openBookingModal();
                }}
              >
                Записаться на приём
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Внешний модал из feature-слоя */}
      {selectedDoctor && (
        <BookingModal
          isOpen={isModalOpen}
          doctorName={selectedDoctor.name}
          onClose={closeBookingModal}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};
