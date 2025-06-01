export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'scheduled' | 'rescheduled';

export interface Appointment {
  id: string;
  userId: string;
  consultantId: string;
  date: Date;
  duration: number; // in minutes
  startTime?: string;
  endTime?: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ConsultantSchedule {
  id: string;
  consultantId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
