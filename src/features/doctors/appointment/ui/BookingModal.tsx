import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "@/shared/ui/providers/theme/hooks/useTheme";
import { getDefaultTimeSlots } from "../lib/time-slots";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

interface BookingModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
   onConfirm: (date: Date, time: string) => void;  
  isLoading?: boolean;  // ← ← ← Новый проп для управления загрузкой извне
}

export const BookingModal: React.FC<BookingModalProps> = ({
  doctor,
  isOpen,
  onClose,
  onSuccess,
  isLoading = false,  // ← По умолчанию false
}) => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [error, setError] = useState("");
  const timeSlots = getDefaultTimeSlots();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;

    setError("");

    // Получаем данные пользователя
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userStr || !token) {
      setError("Пожалуйста, войдите в систему");
      return;
    }

    const user = JSON.parse(userStr);

    try {
      const response = await fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          doctorId: doctor.id,
          doctorName: doctor.name,
          date: selectedDate.toISOString().split("T")[0],
          time: selectedTime,
          comment: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при создании записи");
      }

      // Успех!
      if (onSuccess) {
        onSuccess();
      }
      
      // Закрываем модалку
      onClose();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка подключения к серверу");
      // Не сбрасываем loading здесь — это делает родитель
    }
  };

  // Блокируем взаимодействие если внешняя загрузка
  const isDisabled = isLoading;

  return (
    <>
      {/* Фон с blur */}
      <div
        className={`fixed inset-0 backdrop-blur-sm bg-white/30 dark:bg-black/30 z-40 ${isDisabled ? "pointer-events-none" : ""}`}
        onClick={onClose}
      />

      {/* Модальное окно */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`
            relative rounded-xl shadow-2xl p-6 w-full max-w-md
            ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-hospital-dark"}
            border border-gray-200 dark:border-gray-700
            ${isDisabled ? "opacity-70 pointer-events-none" : ""}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-hospital-primary mb-4 text-center">
            📅 Запись к врачу
          </h3>
          <p className="mb-4 text-center opacity-90 font-medium">{doctor.name}</p>
          <p className="mb-6 text-center text-sm opacity-75">{doctor.specialty}</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Этап 1: выбор даты */}
          {!selectedDate ? (
            <div>
              <p className="mb-4 text-center">Выберите дату приёма:</p>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => !isDisabled && setSelectedDate(date)}
                inline
                minDate={new Date()}
                calendarClassName={theme === "dark" ? "dark" : ""}
                disabled={isDisabled}
              />
            </div>
          ) : !selectedTime ? (
            /* Этап 2: выбор времени */
            <div>
              <p className="mb-2 text-center">
                Вы выбрали:{" "}
                <strong>{selectedDate.toLocaleDateString("ru-RU")}</strong>
              </p>
              <p className="mb-3 font-medium text-center">Выберите время:</p>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    disabled={isDisabled}
                    className={`
                      py-2 px-3 rounded-lg text-sm font-medium
                      transition-colors
                      ${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      }
                      ${
                        selectedTime === time
                          ? "ring-2 ring-hospital-primary bg-hospital-primary text-white"
                          : ""
                      }
                      ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                    onClick={() => !isDisabled && setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={isDisabled}
                className={`text-sm block mx-auto ${
                  isDisabled 
                    ? "text-gray-400 cursor-not-allowed" 
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
              >
                ← Назад к выбору даты
              </button>
            </div>
          ) : (
            /* Этап 3: подтверждение */
            <div className="text-center">
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm mb-2 opacity-75">Вы выбрали:</p>
                <p className="text-lg font-bold text-hospital-primary">
                  {selectedDate.toLocaleDateString("ru-RU")} в {selectedTime}
                </p>
                <p className="mt-2 font-medium">{doctor.name}</p>
              </div>
              
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setSelectedTime(null)}
                  disabled={isDisabled}
                >
                  Назад
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-hospital-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleConfirm}
                  disabled={isDisabled}
                >
                  {isLoading ? "⏳ Запись..." : "✅ Подтвердить запись"}
                </button>
              </div>
            </div>
          )}

          {/* Кнопка закрытия */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl disabled:opacity-50"
            onClick={onClose}
            disabled={isDisabled}
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
};