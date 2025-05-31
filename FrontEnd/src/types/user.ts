export type UserRole = 'guest' | 'member' | 'staff' | 'consultant' | 'manager' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: string;
  profilePicture?: string;
  bio?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
