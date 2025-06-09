import axios from "axios";
import { ProgramDTO } from "../dto/ProgramDTO";
import { ProgramSearch } from "../dto/ProgramSearch";

const BASE_URL = process.env.REACT_APP_API_URL;

const URL_CREATE_PROGRAM = `${BASE_URL}/programs/create`;
const URL_UPDATE_PROGRAM = `${BASE_URL}/programs/update`;
const URL_DELETE_PROGRAM = `${BASE_URL}/programs/delete`;
const URL_FIND_ALL_PROGRAM = `${BASE_URL}/programs/find-all`;
const URL_FIND_BY_ID_PROGRAM = `${BASE_URL}/programs`;

export class ProgramService {
    public async createProgram(programDTO: ProgramDTO) {
        const response = await axios.post(URL_CREATE_PROGRAM, programDTO);
        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
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
} 