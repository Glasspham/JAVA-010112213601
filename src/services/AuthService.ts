import axios from "axios";
import { LoginDTO } from "../pages/auth/LoginDTO";
import { AuthenDTO } from "../pages/auth/AuthenDTO";
import * as jwt_decode from 'jwt-decode';
import { Link, Navigate, useNavigate } from 'react-router-dom';


interface MyTokenPayload {
    sub: string;
    username: string;
    role: string;
    exp?: number;
    iat?: number;
}

const BASE_URL = process.env.REACT_APP_API_URL;

const API_LOGIN = `${BASE_URL}/auth/login`;


export class AuthService {
    public async login(loginDTO: LoginDTO) {

        const response = await axios.post(API_LOGIN, loginDTO);
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

