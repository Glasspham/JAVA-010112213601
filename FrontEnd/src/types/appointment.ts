export type AppointmentStatus = "PENDING" | "CONFIRM" | "COMPLETE" | "CANCEL";

export interface Appointment {
  id: number;
  userId: number;
  userName: string;
  userFullName: string;
  specialistId: number;
  specialistName: string;
  specialistFullname: string;
  date: string;
  hours: string;
  duration: number;
  status: string;
}

export interface AppointmentCreateRequest {
  id: number;
  username: string;
  specialistName: string;
  date: string;
  hours: string;
  duration: number;
  status: string;
}

export interface AppointmentSearchParams {
  page: number;
  limit: number;
  keyword?: string;
  status?: string;
  date?: string;
}

export interface PaginatedAppointmentResponse {
  content: Appointment[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface Specialist {
  id: number;
  username: string;
  fullname: string;
  email: string;
  avatar: string;
  position: string;
  phone: string;
  majors: string[];
  role: string;
  createDate: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string | null;
  data: T;
}

export interface ConsultantSchedule {
  id: string;
  consultantId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
