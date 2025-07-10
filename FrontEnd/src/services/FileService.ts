import httpClient from "../utils/httpClient";

export class FileService {
  public async uploadFile(file: any) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await httpClient.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return [response.data.code, response.data.data, response.data.message];
    } catch (error: any) {
      return [500, null, error.message || "Failed to upload file"];
    }
  }
}
