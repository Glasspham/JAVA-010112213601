import { User, UserRole } from '../types/user';

// Status removed from all program interfaces

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'guest@example.com',
    firstName: 'Guest',
    lastName: 'User',
    role: 'guest' as UserRole,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    email: 'member@example.com',
    firstName: 'Member',
    lastName: 'User',
    role: 'member' as UserRole,
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
  },
  {
    id: '3',
    email: 'staff@example.com',
    firstName: 'Staff',
    lastName: 'User',
    role: 'staff' as UserRole,
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03'),
  },
  {
    id: '4',
    email: 'consultant@example.com',
    firstName: 'Consultant',
    lastName: 'User',
    role: 'consultant' as UserRole,
    createdAt: new Date('2023-01-04'),
    updatedAt: new Date('2023-01-04'),
  },
  {
    id: '5',
    email: 'manager@example.com',
    firstName: 'Manager',
    lastName: 'User',
    role: 'manager' as UserRole,
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-05'),
  },
  {
    id: '6',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as UserRole,
    createdAt: new Date('2023-01-06'),
    updatedAt: new Date('2023-01-06'),
  },
];