export type ProgramStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Program {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  duration: number; // in minutes
  capacity: number;
  registrations: number;
  status: ProgramStatus;
  image?: string;
  createdAt: Date;

  // Client-side properties
  startDate?: Date;
  endDate?: Date;
  registeredCount?: number;
  updatedAt?: Date;
}

export interface CommunityProgram {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  registeredCount: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramRegistration {
  id: string;
  userId: string;
  programId: string;
  registeredAt: Date;
  attended: boolean;
  feedback?: string;
  preSurveyId?: string;
  postSurveyId?: string;
}
