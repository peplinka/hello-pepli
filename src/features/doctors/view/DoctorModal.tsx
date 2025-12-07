// src/pages/Doctors/ui/DoctorModal.tsx
import React from 'react';
import { Modal } from '@/shared/ui/Modal'; // Используем ваш базовый Modal
import { Doctor } from '@/entities/doctors/model/types'; // ✅ Теперь путь корректен: ../model/types -> src/pages/Doctors/model/types.ts

interface DoctorModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorModal: React.FC<DoctorModalProps> = ({ doctor, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="doctor-modal-content">
        <h2>{doctor.name}</h2>
        <h3>{doctor.speciality}</h3>
        <p>Стаж: {doctor.experience} лет</p>
        <p>{doctor.description}</p>
        {/* Добавьте фото, контакты и т.д. */}
      </div>
    </Modal>
  );
};