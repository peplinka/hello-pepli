// src/features/appointment/model/types.ts

export interface Appointment {
  doctorId: number;
  date: Date;
  time: string;
}

export type TimeSlot = string; // например, '09:00'
