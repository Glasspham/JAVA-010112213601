import axios from "axios";
import { LoginDTO } from "../pages/auth/LoginDTO";
import { RegisterDTO } from "../pages/auth/RegisterDTO";
import { AuthenDTO } from "../pages/auth/AuthenDTO";
import { UpdateProfileDTO } from "../dto/UpdateProfileDTO";
import { UpdatePasswordDTO } from "../dto/UpdatePasswordDTO";
import * as jwt_decode from 'jwt-decode';

interface MyTokenPayload {
    sub: string;
    username: string;
    role: string;
    exp?: number;
    iat?: number;
}

const BASE_URL = process.env.REACT_APP_API_URL;
const API_LOGIN = `${BASE_URL}/auth/login`;
const API_REGISTER = `${BASE_URL}/auth/register`;
const API_FIND_BY_USERNAME = `${BASE_URL}/auth`;
const API_UPDATE_PROFILE = `${BASE_URL}/auth/update`;
const API_UPDATE_PASSWORD = `${BASE_URL}/auth/update-password`;

export class AuthService {
    public async login(loginDTO: LoginDTO) {
        const response = await axios.post(API_LOGIN, loginDTO);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async register(registerDTO: RegisterDTO) {
        const response = await axios.post(API_REGISTER, registerDTO);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async findByUsername(username: string) {
        const response = await axios.get(`${API_FIND_BY_USERNAME}?username=${username}`);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async updateProfile(username: string, updateProfileDTO: UpdateProfileDTO) {
        const response = await axios.put(`${API_UPDATE_PROFILE}?username=${username}`, updateProfileDTO);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async updatePassword(username: string, updatePasswordDTO: UpdatePasswordDTO) {
        const response = await axios.put(`${API_UPDATE_PASSWORD}?username=${username}`, updatePasswordDTO);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async writeInfoToLocal(token: any) {
        const { jwtDecode } = jwt_decode;
        const decoded = jwtDecode<MyTokenPayload>(token);
        localStorage.setItem("TOKEN", token || '');
        localStorage.setItem("USERNAME", decoded.username || '');
        localStorage.setItem("ROLE", decoded.role || '');
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

    public async isAuthen(){
        var authenDTO = await this.readInfoFromLocal();
        if(authenDTO == null || authenDTO.token == null){
            return false;
        }
        return true;
    }
}