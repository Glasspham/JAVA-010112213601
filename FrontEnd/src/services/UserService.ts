import axios from "axios";
import { UserSearch } from "../dto/UserSearch";
import { UserDTO } from "../dto/UserDTO";
import { FileService } from "./FileService";

const BASE_URL = process.env.REACT_APP_API_URL;
const URL_FIND_ALL_USER = `${BASE_URL}/users/find-all`;
const URL_CREATE_USER = `${BASE_URL}/users/create`;
const URL_DELETE_USER = `${BASE_URL}/users/delete`;
const URL_GET_USER_BY_ID = `${BASE_URL}/users`;
const URL_UPDATE_USER = `${BASE_URL}/users/update`;

export class UserService {
    public async findAll(userSearch: UserSearch) {
        const params = new URLSearchParams();
        if (userSearch.keyword) params.append("keyword", userSearch.keyword);
        if (userSearch.roleName) params.append("roleName", userSearch.roleName);
        if (userSearch.majorName) params.append("majorName", userSearch.majorName);
        if (userSearch.page !== undefined) params.append("page", String(userSearch.page));
        if (userSearch.limit !== undefined) params.append("limit", String(userSearch.limit));
        const queryString = params.toString();
        const urlParam = queryString ? `${URL_FIND_ALL_USER}?${queryString}` : URL_FIND_ALL_USER;
        console.log('UserService calling API:', urlParam);
        const response = await axios.get(urlParam);
        console.log('UserService API response:', response.data);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async createUser(userDTO: UserDTO, avatar: any) {
        const _fileService = new FileService();
        if (avatar) {
            const [codeImage, urlImage, messImage] = await _fileService.uploadFile(avatar);
            if (urlImage != null)
                userDTO.avatar = urlImage;
        }
        const response = await axios.post(URL_CREATE_USER, userDTO);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async deleteUser(id: any){
        const response = await axios.delete(`${URL_DELETE_USER}/${id}`);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async getUserById(id: number) {
        const response = await axios.get(`${URL_GET_USER_BY_ID}?id=${id}`);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }

    public async updateUser(id: number, userDTO: UserDTO, avatar?: File) {
        const _fileService = new FileService();
        // Upload avatar nếu có file mới
        if (avatar) {
            const [codeImage, urlImage, messImage] = await _fileService.uploadFile(avatar);
            if (urlImage != null) {
                userDTO.avatar = urlImage;
            }
        }
        const response = await axios.put(`${URL_UPDATE_USER}/${id}`, userDTO);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }
}