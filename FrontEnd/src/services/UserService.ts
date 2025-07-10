import httpClient from "../utils/httpClient";
import { UserSearch } from "../dto/UserSearch";
import { UserDTO } from "../dto/UserDTO";
import { FileService } from "./FileService";

export class UserService {
  public async findAll(userSearch: UserSearch) {
    try {
      const params = new URLSearchParams();
      if (userSearch.keyword) params.append("keyword", userSearch.keyword);
      if (userSearch.roleName) params.append("roleName", userSearch.roleName);
      if (userSearch.majorName) params.append("majorName", userSearch.majorName);
      if (userSearch.page !== undefined) params.append("page", String(userSearch.page));
      if (userSearch.limit !== undefined) params.append("limit", String(userSearch.limit));

      const queryString = params.toString();
      const endpoint = queryString ? `/users/find-all?${queryString}` : "/users/find-all";
      console.log("UserService calling API:", endpoint);

      const response = await httpClient.get(endpoint);
      console.log("UserService API response:", response.data);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      console.error("UserService findAll error:", error);
      return [500, null, error.message || "Failed to fetch users"];
    }
  }

  public async createUser(userDTO: UserDTO, avatar: any) {
    try {
      const _fileService = new FileService();
      if (avatar) {
        const [codeImage, urlImage, messImage] = await _fileService.uploadFile(avatar);
        if (urlImage != null) userDTO.avatar = urlImage;
      }
      const response = await httpClient.post("/users/create", userDTO);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to create user"];
    }
  }

  public async deleteUser(id: any) {
    try {
      const response = await httpClient.delete(`/users/delete/${id}`);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to delete user"];
    }
  }

  public async getUserById(id: number) {
    try {
      const response = await httpClient.get(`/users?id=${id}`);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to get user"];
    }
  }

  public async updateUser(id: number, userDTO: UserDTO, avatar?: File) {
    try {
      const _fileService = new FileService();
      // Upload avatar nếu có file mới
      if (avatar) {
        const [codeImage, urlImage, messImage] = await _fileService.uploadFile(avatar);
        if (urlImage != null) {
          userDTO.avatar = urlImage;
        }
      }
      const response = await httpClient.put(`/users/update/${id}`, userDTO);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to update user"];
    }
  }
}
