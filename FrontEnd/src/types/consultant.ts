export type ConsultantSpecialty = 'addiction' | 'youth' | 'family' | 'education' | 'mental_health';

export interface Consultant {
  id: string;
  name: string;
  title: string;
  specialty: ConsultantSpecialty[];
  bio: string;
  email: string;
  phone: string;
  avatar?: string;
  rating: number;
  availability: boolean;
  createdAt: Date;

  // Client-side properties
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  specialization?: string[];
  education?: string;
  experience?: number;
  reviewCount?: number;
  phoneNumber?: string;
  availableDays?: number[];
  availableHours?: {
    start: string;
    end: string;
  };
}

export interface ConsultantDetail {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialization: string[];
  education: string;
  experience: number; // in years
  bio: string;
  profilePicture: string;
  availableDays: number[]; // 0-6 (Sunday-Saturday)
  availableHours: {
    start: string;
    end: string;
  };
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsultantReview {
  id: string;
  consultantId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
