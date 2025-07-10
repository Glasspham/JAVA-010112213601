import httpClient from "../utils/httpClient";
import { Survey, SurveySearch, PaginatedSurveyResponse, ApiResponse, SurveyMark } from "../types/survey";

export class SurveyService {
  public async findAllSurveys(searchParams: SurveySearch): Promise<[number, PaginatedSurveyResponse, string]> {
    try {
      const params = new URLSearchParams({
        page: searchParams.page.toString(),
        limit: searchParams.limit.toString(),
      });

      if (searchParams.keyword) {
        params.append("keyword", searchParams.keyword);
      }

      if (searchParams.type) {
        params.append("type", searchParams.type);
      }

      const response = await httpClient.get<ApiResponse<PaginatedSurveyResponse>>(`/survey/find-all?${params.toString()}`);
      return [response.data.code, response.data.data, response.data.message || ""];
    } catch (error: any) {
      return [500, {} as PaginatedSurveyResponse, error.message || "Failed to fetch surveys"];
    }
  }

  public async createSurvey(survey: Survey): Promise<[number, Survey, string]> {
    try {
      const response = await httpClient.post<ApiResponse<Survey>>("/survey/create", survey);
      return [response.data.code, response.data.data, response.data.message || ""];
    } catch (error: any) {
      return [500, {} as Survey, error.message || "Failed to create survey"];
    }
  }

  public async getSurveyById(id: number): Promise<[number, Survey, string]> {
    try {
      const response = await httpClient.get<ApiResponse<Survey>>(`/survey?id=${id}`);
      return [response.data.code, response.data.data, response.data.message || ""];
    } catch (error: any) {
      return [500, {} as Survey, error.message || "Failed to fetch survey"];
    }
  }

  public async updateSurvey(id: number, survey: Survey): Promise<[number, Survey, string]> {
    try {
      const response = await httpClient.put<ApiResponse<Survey>>(`/survey/update/${id}`, survey);
      return [response.data.code, response.data.data, response.data.message || ""];
    } catch (error: any) {
      return [500, {} as Survey, error.message || "Failed to update survey"];
    }
  }

  public async deleteSurvey(id: number): Promise<[number, string, string]> {
    try {
      const response = await httpClient.delete<ApiResponse<string>>(`/survey/delete/${id}`);
      return [response.data.code, response.data.data, response.data.message || ""];
    } catch (error: any) {
      return [500, "", error.message || "Failed to delete survey"];
    }
  }

  // API chấm điểm
  public async markSurvey(username: string, idSurvey: number, mark: number): Promise<[number, any, string]> {
    try {
      const response = await httpClient.post<ApiResponse<any>>("/survey/mark", {
        username,
        idSurvey,
        mark,
      });
      return [response.data.code, response.data.data, response.data.message || ""];
    } catch (error: any) {
      return [500, null, error.message || "Failed to mark survey"];
    }
  }

  // API lấy danh sách điểm
  public async getMarkHistory(username: string, idSurvey?: number): Promise<[number, SurveyMark[], string]> {
    try {
      const params = new URLSearchParams({ username });
      if (idSurvey) {
        params.append("idSurvey", idSurvey.toString());
      }

      const response = await httpClient.get<ApiResponse<SurveyMark[]>>(`/survey/list-mark?${params.toString()}`);
      return [response.data.code, response.data.data, response.data.message || ""];
    } catch (error: any) {
      return [500, [], error.message || "Failed to fetch mark history"];
    }
  }
}
