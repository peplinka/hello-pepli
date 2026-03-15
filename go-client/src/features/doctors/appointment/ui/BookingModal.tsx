// src/features/appointment/ui/BookingModal.tsx

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "@/shared/ui/providers/theme/hooks/useTheme";
import { getDefaultTimeSlots } from "../lib/time-slots";

interface BookingModalProps {
  doctorName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date, time: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  doctorName,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const timeSlots = getDefaultTimeSlots();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
    }
  };

  return (
    <>
      {/* Фон с blur */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-white/30 dark:bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Модальное окно */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`
            relative rounded-xl shadow-2xl p-6 w-full max-w-md
            ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-hospital-dark"}
            border border-gray-200 dark:border-gray-700
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-hospital-primary mb-4 text-center">
            Запись к доктору
          </h3>
          <p className="mb-4 text-center opacity-90">{doctorName}</p>

          {/* Этап 1: выбор даты */}
          {!selectedDate ? (
            <div>
              <p className="mb-4 text-center">Выберите дату приёма:</p>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
                minDate={new Date()}
                calendarClassName={theme === "dark" ? "dark" : ""}
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
                    `}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 block mx-auto"
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
              <p className="mb-2">Вы выбрали:</p>
              <p className="text-lg font-semibold">
                {selectedDate.toLocaleDateString("ru-RU")} в {selectedTime}
              </p>
              <p className="mb-4 text-hospital-primary">{doctorName}</p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                  onClick={() => setSelectedTime(null)}
                >
                  Назад
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-hospital-primary text-white rounded-lg font-medium hover:bg-opacity-90"
                  onClick={handleConfirm}
                >
                  Записаться
                </button>
              </div>
            </div>
          )}

          {/* Кнопка закрытия */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
};
