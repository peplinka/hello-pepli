import React, { useState } from "react";
import { useTheme } from "@/shared/ui/providers/theme/hooks/useTheme";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
  const [bookingError, setBookingError] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  // ✅ Обработка успешной записи
  const handleBookingSuccess = () => {
    alert(`✅ Запись успешно создана!\nВрач: ${selectedDoctor?.name}`);
    setIsModalOpen(false);
    setBookingError("");
  };

  const handleCardClick = (doctor: Doctor) => {
    setSelectedDoctor((prev) => (prev?.id === doctor.id ? null : doctor));
  };

  const openBookingModal = () => {
    // 🔐 Проверка авторизации
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      navigate("/auth", { state: { from: "/doctors" } });
      return;
    }
    
    if (selectedDoctor) {
      setBookingError("");
      setIsModalOpen(true);
    }
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setBookingError("");
  };

  // ✅ Основная функция записи
  const handleConfirmBooking = async (date: Date, time: string) => {
    if (!selectedDoctor) return;
    
    // 1. Включаем загрузку
    setIsBooking(true);
    setBookingError("");

    // 2. Проверяем авторизацию
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!userStr || !token) {
      setBookingError("Пожалуйста, войдите в систему");
      setIsBooking(false);
      navigate("/auth");
      return;
    }

    const user = JSON.parse(userStr);

    try {
      // 3. Отправка на Go backend
      const response = await fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          date: date.toISOString().split("T")[0],
          time: time,
          comment: "",
        }),
      });

      const data = await response.json();

     if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Ошибка при создании записи");
  }
      // 4. Успех
      handleBookingSuccess();
      
    } catch (err) {
  console.error("Booking error:", err);
  const errorMsg = err instanceof Error ? err.message : "Ошибка подключения к серверу";
  
  // Показываем ошибку в красном блоке
  setBookingError(errorMsg);
  
  // И в alert для наглядности
  alert("❌ " + errorMsg);
} finally {
  setIsBooking(false);
}
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
                  ${isBooking ? "opacity-50 cursor-not-allowed" : ""}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  openBookingModal();
                }}
                disabled={isBooking}
              >
                {isBooking ? "Запись..." : "Записаться на приём"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 🔴 Уведомление об ошибке */}
      {bookingError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          {bookingError}
          <button 
            className="ml-4 font-bold" 
            onClick={() => setBookingError("")}
          >
            ✕
          </button>
        </div>
      )}

      {/* Модальное окно записи */}
      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          isOpen={isModalOpen}
          onClose={closeBookingModal}
          onSuccess={handleBookingSuccess}
          isLoading={isBooking}
        />
      )}
    </div>
  );
};