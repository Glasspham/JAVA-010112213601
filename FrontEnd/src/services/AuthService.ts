import httpClient from "../utils/httpClient";
import { LoginDTO } from "../pages/auth/LoginDTO";
import { RegisterDTO } from "../pages/auth/RegisterDTO";
import { AuthenDTO } from "../pages/auth/AuthenDTO";
import { UpdateProfileDTO } from "../dto/UpdateProfileDTO";
import { UpdatePasswordDTO } from "../dto/UpdatePasswordDTO";
import * as jwt_decode from "jwt-decode";

interface MyTokenPayload {
  sub: string;
  username: string;
  role: string;
  exp?: number;
  iat?: number;
}

export class AuthService {
  public async login(loginDTO: LoginDTO) {
    try {
      const response = await httpClient.post("/auth/login", loginDTO);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Login failed"];
    }
  }

  public async register(registerDTO: RegisterDTO) {
    try {
      const response = await httpClient.post("/auth/register", registerDTO);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Registration failed"];
    }
  }

  public async findByUsername(username: string) {
    try {
      const response = await httpClient.get(`/auth?username=${username}`);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to find user"];
    }
  }

  public async updateProfile(username: string, updateProfileDTO: UpdateProfileDTO) {
    try {
      const response = await httpClient.put(`/auth/update?username=${username}`, updateProfileDTO);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to update profile"];
    }
  }

  public async updatePassword(username: string, updatePasswordDTO: UpdatePasswordDTO) {
    try {
      const response = await httpClient.put(`/auth/update-password?username=${username}`, updatePasswordDTO);
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to update password"];
    }
  }

  public async writeInfoToLocal(token: any) {
    const { jwtDecode } = jwt_decode;
    const decoded = jwtDecode<MyTokenPayload>(token);
    localStorage.setItem("TOKEN", token || "");
    localStorage.setItem("USERNAME", decoded.username || "");
    localStorage.setItem("ROLE", decoded.role || "");
  }

  public async readInfoFromLocal() {
    const token = localStorage.getItem("TOKEN") ?? undefined;
    const userName = localStorage.getItem("USERNAME") ?? undefined;
    const role = localStorage.getItem("ROLE") ?? undefined;
    var authenDTO = new AuthenDTO();
    authenDTO.token = token;
    authenDTO.userName = userName;
    authenDTO.role = role;
    return authenDTO;
  }

  public async deleteInfoFromLocal() {
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USERNAME");
    localStorage.removeItem("ROLE");
  }

  public async isAuthen() {
    var authenDTO = await this.readInfoFromLocal();
    if (authenDTO == null || authenDTO.token == null) {
      return false;
    }
    return true;
  }
}
