import axios from 'axios';
import { 
  Appointment, 
  AppointmentCreateRequest, 
  AppointmentSearchParams, 
  PaginatedAppointmentResponse, 
  Specialist,
  ApiResponse 
} from '../types/appointment';

const BASE_URL = 'http://localhost:8080';
const URL_FIND_ALL_APPOINTMENTS = `${BASE_URL}/appoinments/find-all`;
const URL_CREATE_APPOINTMENT = `${BASE_URL}/appoinments/create`;
const URL_LIST_SPECIALISTS = `${BASE_URL}/users/list-specialist`;
const URL_LIST_USERS = `${BASE_URL}/users/list-user`;
const URL_CHANGE_STATUS = `${BASE_URL}/appoinments/change-status`;

export class AppointmentService {
  public async findAllAppointments(searchParams: AppointmentSearchParams): Promise<[number, PaginatedAppointmentResponse, string]> {
    let url = `${URL_FIND_ALL_APPOINTMENTS}?page=${searchParams.page}&limit=${searchParams.limit}`;
    
    if (searchParams.keyword) {
      url += `&keyword=${encodeURIComponent(searchParams.keyword)}`;
    }
    
    if (searchParams.status) {
      url += `&status=${encodeURIComponent(searchParams.status)}`;
    }
    
    if (searchParams.date) {
      url += `&date=${encodeURIComponent(searchParams.date)}`;
    }

    const response = await axios.get<ApiResponse<PaginatedAppointmentResponse>>(url);
    return [
      response.data.code,
      response.data.data,
      response.data.message || ''
    ];
  }

  public async createAppointment(appointment: AppointmentCreateRequest): Promise<[number, Appointment, string]> {
    const response = await axios.post<ApiResponse<Appointment>>(URL_CREATE_APPOINTMENT, appointment);
    return [
      response.data.code,
      response.data.data,
      response.data.message || ''
    ];
  }

  public async getSpecialists(): Promise<[number, Specialist[], string]> {
    const response = await axios.get<ApiResponse<Specialist[]>>(URL_LIST_SPECIALISTS);
    return [
      response.data.code,
      response.data.data,
      response.data.message || ''
    ];
  }

  public async getUsers(): Promise<[number, Specialist[], string]> {
    const response = await axios.get<ApiResponse<Specialist[]>>(URL_LIST_USERS);
    return [
      response.data.code,
      response.data.data,
      response.data.message || ''
    ];
  }

  public async findAppointmentsByUsername(params: {
    page: number;
    limit: number;
    username: string;
    status?: string;
    date?: string;
  }): Promise<[number, PaginatedAppointmentResponse, string]> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      username: params.username
    });

    if (params.status) {
      queryParams.append('status', params.status);
    }
    if (params.date) {
      queryParams.append('date', params.date);
    }

    const response = await axios.get<ApiResponse<PaginatedAppointmentResponse>>(
      `${URL_FIND_ALL_APPOINTMENTS}?${queryParams.toString()}`
    );
    return [
      response.data.code,
      response.data.data,
      response.data.message || ''
    ];
  }

  public async changeAppointmentStatus(appointmentId: number, status: string): Promise<[number, Appointment, string]> {
    const response = await axios.put<ApiResponse<Appointment>>(
      `${URL_CHANGE_STATUS}/${appointmentId}`,
      { status }
    );
    return [
      response.data.code,
      response.data.data,
      response.data.message || ''
    ];
  }
}
