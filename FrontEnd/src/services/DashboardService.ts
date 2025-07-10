import httpClient from "../utils/httpClient";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export interface DashboardStats {
  cntUser: number;
  cntSpecialist: number;
  cntCourse: number;
  cntProgram: number;
}

export interface MonthlyStats {
  cntProgram: number;
  cntRegister: number;
}

export interface LocationStats {
  location: string;
  count: number;
}

export interface DashboardResponse {
  code: number;
  message: string | null;
  data: DashboardStats;
}

export interface YearlyStatsResponse {
  code: number;
  message: string | null;
  data: MonthlyStats[];
}

export interface LocationStatsResponse {
  code: number;
  message: string | null;
  data: LocationStats[];
}

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await httpClient.get<DashboardResponse>("/static/dashboard");

      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch dashboard stats");
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }

  async getYearlyStats(year: number): Promise<MonthlyStats[]> {
    try {
      const response = await httpClient.get<YearlyStatsResponse>(`/static/static-year?year=${year}`);

      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch yearly stats");
      }
    } catch (error) {
      console.error("Error fetching yearly stats:", error);
      throw error;
    }
  }

  async getLocationStats(year: number): Promise<LocationStats[]> {
    try {
      const response = await httpClient.get<LocationStatsResponse>(`/static/static-location-year?year=${year}`);

      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch location stats");
      }
    } catch (error) {
      console.error("Error fetching location stats:", error);
      throw error;
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
