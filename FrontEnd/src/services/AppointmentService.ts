import httpClient from "../utils/httpClient";
import { Appointment, AppointmentCreateRequest, AppointmentSearchParams, PaginatedAppointmentResponse, Specialist, ApiResponse } from "../types/appointment";

export class AppointmentService {
  public async findAllAppointments(searchParams: AppointmentSearchParams): Promise<[number, PaginatedAppointmentResponse, string]> {
    try {
      const params = new URLSearchParams({
        page: searchParams.page.toString(),
        limit: searchParams.limit.toString(),
      });

      if (searchParams.keyword) {
        params.append("keyword", searchParams.keyword);
      }

      if (searchParams.status) {
        params.append("status", searchParams.status);
      }

      if (searchParams.date) {
        params.append("date", searchParams.date);
      }

      const response = await httpClient.get<ApiResponse<PaginatedAppointmentResponse>>(`/appointments/find-all?${params.toString()}`);
      return [response.data.code, response.data.data, response.data.message || ""];
    } catch (error: any) {
      return [500, {} as PaginatedAppointmentResponse, error.message || "Failed to fetch appointments"];
    }
  }

  public async createAppointment(appointment: AppointmentCreateRequest): Promise<[number, Appointment, string]> {
    try {
      const response = await httpClient.post<ApiResponse<Appointment>>("/appointments/create", appointment);
      return [response.data.code, response.data.data, response.data.message || ""];
    } catch (error: any) {
      return [500, {} as Appointment, error.message || "Failed to create appointment"];
    }
  }

  public async getSpecialists(): Promise<[number, Specialist[], string]> {
    try {
      const response = await httpClient.get<ApiResponse<Specialist[]>>("/users/list-specialist");
      return [response.data.code, response.data.data, response.data.message || ""];
    } catch (error: any) {
      return [500, [], error.message || "Failed to fetch specialists"];
    }
  }

  public async getUsers(): Promise<[number, Specialist[], string]> {
    try {
      const response = await httpClient.get<ApiResponse<Specialist[]>>("/users/list-user");
      return [response.data.code, response.data.data, response.data.message || ""];
    } catch (error: any) {
      return [500, [], error.message || "Failed to fetch users"];
    }
  }

  public async findAppointmentsByUsername(params: { page: number; limit: number; username: string; status?: string; date?: string }): Promise<[number, PaginatedAppointmentResponse, string]> {
    try {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
        username: params.username,
      });

      if (params.status) {
        queryParams.append("status", params.status);
      }
      if (params.date) {
        queryParams.append("date", params.date);
      }

      const response = await httpClient.get<ApiResponse<PaginatedAppointmentResponse>>(`/appointments/find-all?${queryParams.toString()}`);
      return [response.data.code, response.data.data, response.data.message || ""];
    } catch (error: any) {
      return [500, {} as PaginatedAppointmentResponse, error.message || "Failed to fetch appointments"];
    }
  }

  public async changeAppointmentStatus(appointmentId: number, status: string): Promise<[number, Appointment, string]> {
    try {
      const response = await httpClient.put<ApiResponse<Appointment>>(`/appointments/change-status/${appointmentId}`, { status });
      return [response.data.code, response.data.data, response.data.message || ""];
    } catch (error: any) {
      return [500, {} as Appointment, error.message || "Failed to change appointment status"];
    }
  }
}
