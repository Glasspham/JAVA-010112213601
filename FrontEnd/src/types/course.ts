export type AudienceType = 'student' | 'parent' | 'teacher' | 'general';
export type LessonType = 'video' | 'text' | 'quiz' | 'interactive' | 'assignment';
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
export type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed' | 'dropped';

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
  // Extended properties
  lessons?: Lesson[];
  totalLessons?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  instructor?: string;
  certificate?: boolean;
  prerequisites?: string[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: LessonType;
  duration: number; // in minutes
  order: number;
  content: string;
  videoUrl?: string;
  materials?: LessonMaterial[];
  quiz?: Quiz;
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonMaterial {
  id: string;
  lessonId: string;
  title: string;
  type: 'pdf' | 'doc' | 'image' | 'link' | 'video';
  url: string;
  description?: string;
  downloadable: boolean;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  maxAttempts: number;
  questions: QuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  type: QuestionType;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number; // percentage
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt?: Date;
  certificateIssued?: boolean;
  certificateUrl?: string;
  finalScore?: number;
  timeSpent?: number; // in minutes
}

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  userId: string;
  completed: boolean;
  progress: number; // percentage
  timeSpent: number; // in minutes
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  enrollmentId: string;
  attemptNumber: number;
  score: number; // percentage
  answers: QuizAnswer[];
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in minutes
  passed: boolean;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
}

export interface CourseReview {
  id: string;
  userId: string;
  courseId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  // User info for display
  userName?: string;
  userAvatar?: string;
}

export interface CourseNote {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  content: string;
  timestamp?: number; // for video notes
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseDiscussion {
  id: string;
  courseId: string;
  lessonId?: string;
  userId: string;
  title: string;
  content: string;
  replies: DiscussionReply[];
  createdAt: Date;
  updatedAt: Date;
  // User info for display
  userName?: string;
  userAvatar?: string;
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  // User info for display
  userName?: string;
  userAvatar?: string;
}
