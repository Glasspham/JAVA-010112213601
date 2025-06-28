import axios from 'axios';
import { Survey, SurveySearch, PaginatedSurveyResponse, ApiResponse, SurveyMark } from '../types/survey';

const BASE_URL = 'http://localhost:8080';
const URL_FIND_ALL_SURVEYS = `${BASE_URL}/survey/find-all`;
const URL_CREATE_SURVEY = `${BASE_URL}/survey/create`;
const URL_GET_SURVEY = `${BASE_URL}/survey`;

export class SurveyService {
  public async findAllSurveys(searchParams: SurveySearch): Promise<[number, PaginatedSurveyResponse, string]> {
    let url = `${URL_FIND_ALL_SURVEYS}?page=${searchParams.page}&limit=${searchParams.limit}`;
    
    if (searchParams.keyword) {
      url += `&keyword=${encodeURIComponent(searchParams.keyword)}`;
    }
    
    if (searchParams.type) {
      url += `&type=${encodeURIComponent(searchParams.type)}`;
    }

    const response = await axios.get<ApiResponse<PaginatedSurveyResponse>>(url);
    return [
      response.data.code,
      response.data.data,
      response.data.message || ''
    ];
  }

  public async createSurvey(survey: Survey): Promise<[number, Survey, string]> {
    const response = await axios.post<ApiResponse<Survey>>(URL_CREATE_SURVEY, survey);
    return [
      response.data.code,
      response.data.data,
      response.data.message || ''
    ];
  }

  public async getSurveyById(id: number): Promise<[number, Survey, string]> {
    const response = await axios.get<ApiResponse<Survey>>(`${URL_GET_SURVEY}?id=${id}`);
    return [
      response.data.code,
      response.data.data,
      response.data.message || ''
    ];
  }

  public async updateSurvey(id: number, survey: Survey): Promise<[number, Survey, string]> {
    const response = await axios.put<ApiResponse<Survey>>(`${BASE_URL}/survey/update/${id}`, survey);
    return [
      response.data.code,
      response.data.data,
      response.data.message || ''
    ];
  }

  public async deleteSurvey(id: number): Promise<[number, string, string]> {
    const response = await axios.delete<ApiResponse<string>>(`${BASE_URL}/survey/delete/${id}`);
    return [
      response.data.code,
      response.data.data,
      response.data.message || ''
    ];
  }

  // API chấm điểm
  public async markSurvey(username: string, idSurvey: number, mark: number): Promise<[number, any, string]> {
    const response = await axios.post<ApiResponse<any>>(`${BASE_URL}/survey/mark`, {
      username,
      idSurvey,
      mark
    });
    return [
      response.data.code,
      response.data.data,
      response.data.message || ''
    ];
  }

  // API lấy danh sách điểm
  public async getMarkHistory(username: string, idSurvey?: number): Promise<[number, SurveyMark[], string]> {
    let url = `${BASE_URL}/survey/list-mark?username=${username}`;
    if (idSurvey) {
      url += `&idSurvey=${idSurvey}`;
    }
    const response = await axios.get<ApiResponse<SurveyMark[]>>(url);
    return [
      response.data.code,
      response.data.data,
      response.data.message || ''
    ];
  }
}
