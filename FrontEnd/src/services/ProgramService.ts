import httpClient from "../utils/httpClient";
import { ProgramDTO } from "../dto/ProgramDTO";
import { ProgramSearch } from "../dto/ProgramSearch";
import { FileService } from "./FileService";

const BASE_URL = process.env.REACT_APP_API_URL;

export class ProgramService {
  private fileService = new FileService();

  public async createProgram(programDTO: ProgramDTO, imageFile?: File) {
    try {
      // Upload image if provided
      if (imageFile) {
        const [imageCode, imageData, imageMessage] = await this.fileService.uploadFile(imageFile);
        if (imageCode === 200 && imageData) {
          programDTO.image = imageData;
        }
      }

      const response = await httpClient.post("/programs/create", programDTO);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to create program"];
    }
  }

  public async updateProgram(id: number, programDTO: ProgramDTO, imageFile?: File) {
    try {
      // Upload image if provided
      if (imageFile) {
        const [imageCode, imageData, imageMessage] = await this.fileService.uploadFile(imageFile);
        if (imageCode === 200 && imageData) {
          programDTO.image = imageData;
        }
      }

      const response = await httpClient.put(`/programs/update/${id}`, programDTO);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to update program"];
    }
  }

  public async deleteProgram(id: number) {
    try {
      const response = await httpClient.delete(`/programs/delete/${id}`);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to delete program"];
    }
  }

  public async findAll(programSearch: ProgramSearch) {
    try {
      const params = new URLSearchParams();

      if (programSearch.keyword) params.append("keyword", programSearch.keyword);
      if (programSearch.status) params.append("status", programSearch.status);
      if (programSearch.date) params.append("date", programSearch.date);
      if (programSearch.page !== undefined) params.append("page", String(programSearch.page));
      if (programSearch.limit !== undefined) params.append("limit", String(programSearch.limit));

      const queryString = params.toString();
      const endpoint = queryString ? `/programs/find-all?${queryString}` : "/programs/find-all";

      const response = await httpClient.get(endpoint);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to fetch programs"];
    }
  }

  public async findById(id: number) {
    try {
      const response = await httpClient.get(`/programs?id=${id}`);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to fetch program"];
    }
  }

  public async isUserRegistered(username: string, programId: number) {
    try {
      const response = await httpClient.get(`/programs/is-register?username=${username}&programId=${programId}`);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, false, error.message || "Failed to check registration"];
    }
  }

  public async getRegisteredPrograms(username: string) {
    try {
      const response = await httpClient.get(`/programs/list-program-register?username=${username}`);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to fetch registered programs"];
    }
  }

  public async getRegisteredUsers(programId: number) {
    try {
      const response = await httpClient.get(`/programs/list-user-register?idProgram=${programId}`);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to fetch registered users"];
    }
  }

  public async registerForProgram(username: string, programId: number) {
    try {
      const response = await httpClient.post("/programs/register", {
        username: username,
        programId: programId,
      });
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to register for program"];
    }
  }

  public async unregisterFromProgram(username: string, programId: number) {
    try {
      const response = await httpClient.post("/programs/unregister", {
        username: username,
        programId: programId,
      });
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to unregister from program"];
    }
  }
}
