import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const URL_UPLOAD_FILE = `${BASE_URL}/files/upload`;

export class FileService {
    public async uploadFile(file: any) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(URL_UPLOAD_FILE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return [
            response.data.code,
            response.data.data,
            response.data.message
        ];
    }
}