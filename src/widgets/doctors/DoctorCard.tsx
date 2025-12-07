// src/pages/Doctors/ui/DoctorCard.tsx

import React, { useState } from 'react';
import { DoctorModal } from '@/features/doctors/view/DoctorModal';
import { Doctor } from '@/entities/doctors/model/types';

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="doctor-card p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {/* Фото */}
      <div className="w-full h-48 bg-gray-200 mb-3 overflow-hidden rounded-t-lg">
        <img
          src={doctor.photoUrl}
          alt={`${doctor.name} — ${doctor.speciality}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Информация */}
      <h3 className="text-lg font-semibold text-hospital-dark">{doctor.name}</h3>
      <p className="text-sm text-hospital-primary mb-3">{doctor.speciality}</p>

      {/* Кнопка */}
      <button
        onClick={openModal}
        className="px-4 py-2 bg-hospital-accent text-white rounded-lg hover:bg-[#e65100] transition-colors"
      >
        Подробнее
      </button>

      {/* Модалка */}
      <DoctorModal
        doctor={doctor}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};