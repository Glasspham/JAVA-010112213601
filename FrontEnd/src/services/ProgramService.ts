import axios from "axios";
import { ProgramDTO } from "../dto/ProgramDTO";
import { ProgramSearch } from "../dto/ProgramSearch";
import { FileService } from "./FileService";

const BASE_URL = process.env.REACT_APP_API_URL;

const URL_CREATE_PROGRAM = `${BASE_URL}/programs/create`;
const URL_UPDATE_PROGRAM = `${BASE_URL}/programs/update`;
const URL_DELETE_PROGRAM = `${BASE_URL}/programs/delete`;
const URL_FIND_ALL_PROGRAM = `${BASE_URL}/programs/find-all`;
const URL_FIND_BY_ID_PROGRAM = `${BASE_URL}/programs`;

export class ProgramService {
    private fileService = new FileService();

    public async createProgram(programDTO: ProgramDTO, imageFile?: File) {
        // Upload image if provided
        if (imageFile) {
            const [imageCode, imageData, imageMessage] = await this.fileService.uploadFile(imageFile);
            if (imageCode === 200 && imageData) {
                programDTO.image = imageData;
            }
        }

        const response = await axios.post(URL_CREATE_PROGRAM, programDTO);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async updateProgram(id: number, programDTO: ProgramDTO, imageFile?: File) {
        // Upload image if provided
        if (imageFile) {
            const [imageCode, imageData, imageMessage] = await this.fileService.uploadFile(imageFile);
            if (imageCode === 200 && imageData) {
                programDTO.image = imageData;
            }
        }

        const response = await axios.put(`${URL_UPDATE_PROGRAM}/${id}`, programDTO);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async deleteProgram(id: number) {
        const response = await axios.delete(`${URL_DELETE_PROGRAM}/${id}`);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public getImageUrl(imagePath: string): string {
        if (!imagePath || imagePath === 'default_no_image.png') {
            return `${BASE_URL}/default_no_image.png`;
        }

        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        return `${BASE_URL}/${imagePath}`;
    }

    public async findAll(programSearch: ProgramSearch) {
        const params = new URLSearchParams();

        if (programSearch.keyword) params.append("keyword", programSearch.keyword);
        if (programSearch.status) params.append("status", programSearch.status);
        if (programSearch.date) params.append("date", programSearch.date);
        if (programSearch.page !== undefined) params.append("page", String(programSearch.page));
        if (programSearch.limit !== undefined) params.append("limit", String(programSearch.limit));

        const queryString = params.toString();
        const urlParam = queryString ? `${URL_FIND_ALL_PROGRAM}?${queryString}` : URL_FIND_ALL_PROGRAM;

        const response = await axios.get(urlParam);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async findById(id: number) {
        const response = await axios.get(`${URL_FIND_BY_ID_PROGRAM}?id=${id}`);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async isUserRegistered(username: string, programId: number) {
        const response = await axios.get(`${BASE_URL}/programs/is-register?username=${username}&programId=${programId}`);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async getRegisteredPrograms(username: string) {
        const response = await axios.get(`${BASE_URL}/programs/list-program-register?username=${username}`);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async getRegisteredUsers(programId: number) {
        const response = await axios.get(`${BASE_URL}/programs/list-user-register?idProgram=${programId}`);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async registerForProgram(username: string, programId: number) {
        const response = await axios.post(`${BASE_URL}/programs/register`, {
            username: username,
            programId: programId
        });
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async unregisterFromProgram(username: string, programId: number) {
        const response = await axios.post(`${BASE_URL}/programs/unregister`, {
            username: username,
            programId: programId
        });
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }
}