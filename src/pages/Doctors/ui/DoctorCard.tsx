// src/pages/Doctors/ui/DoctorCard.tsx
import React, { useState } from 'react';
import { DoctorModal } from './DoctorModal'; // Или путь к модалке
import { Doctor } from '../model/types';

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => { // ✅ Обязательно export
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="doctor-card">
      <h3>{doctor.name}</h3>
      <p>{doctor.speciality}</p>
      <button onClick={openModal}>Подробнее</button>

      <DoctorModal
        doctor={doctor}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};