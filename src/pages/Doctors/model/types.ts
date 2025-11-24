// src/pages/Doctors/model/types.ts
export interface Doctor { // ✅ Обязательно export
  id: string;
  name: string;
  speciality: string;
  experience: number;
  description: string;
  photoUrl?: string; // Опционально
}