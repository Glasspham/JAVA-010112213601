export type AudienceType = 'student' | 'parent' | 'teacher' | 'general';

export interface Course {
  id: string;
  title: string;
  description: string;
  audienceType: AudienceType[];
  duration: number; // in minutes
  thumbnail: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number; // percentage
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
}
