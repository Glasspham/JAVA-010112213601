import httpClient from "../utils/httpClient";
import { FileService } from "./FileService";

const BASE_URL = process.env.REACT_APP_API_URL;

export interface ApiResponse<T> {
  code: number;
  message: string | null;
  data: T;
}

export interface CourseSearch {
  keyword?: string;
  object?: string;
  page: number;
  limit: number;
}

export interface CourseDetailItem {
  id?: number;
  name: string;
  video: string;
  duration: number;
  objective: string;
  content: string;
}

export interface CourseDetail {
  id?: number;
  name: string;
  description: string;
  duration: number;
  sallybus?: string | null;
  image: string;
  createDate: string;
  updateDate: string;
  objects: string[];
  courseDetail: CourseDetailItem[];
}

export interface CourseDTO {
  id?: number;
  name: string;
  description: string;
  image: string;
  objects: string[];
  courseDetail: CourseDetailItem[];
}

export interface CourseResponse {
  id: number;
  name: string;
  description: string;
  duration?: number;
  sallybus?: string;
  image: string;
  createDate: string;
  updateDate: string;
  objects: string[];
  courseDetail: CourseDetailItem[];
}

export interface PaginatedCourseResponse {
  content: CourseResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export class CourseService {
  private fileService = new FileService();

  public async findAllCourses(searchParams: CourseSearch) {
    let url = `/courses/find-all?page=${searchParams.page}&limit=${searchParams.limit}`;

    if (searchParams.keyword) {
      url += `&keyword=${encodeURIComponent(searchParams.keyword)}`;
    }

    if (searchParams.object) {
      url += `&object=${encodeURIComponent(searchParams.object)}`;
    }

    const response = await httpClient.get(url);
    return [response.data.code, response.data.data as PaginatedCourseResponse, response.data.message];
  }

  public async createCourse(courseDTO: CourseDTO, imageFile?: File, videoFiles?: { [key: number]: File }) {
    try {
      // Upload image if provided
      if (imageFile) {
        const [imageCode, imageData, imageMessage] = await this.fileService.uploadFile(imageFile);
        if (imageCode === 200 && imageData) {
          courseDTO.image = imageData;
        }
      }

      // Upload videos for course details if provided
      if (videoFiles) {
        for (let i = 0; i < courseDTO.courseDetail.length; i++) {
          const videoFile = videoFiles[i];
          if (videoFile) {
            const [videoCode, videoData, videoMessage] = await this.fileService.uploadFile(videoFile);
            if (videoCode === 200 && videoData) {
              courseDTO.courseDetail[i].video = videoData;
            }
          }
        }
      }

      const response = await httpClient.post("/courses/create", courseDTO);
      return [response.data.code, response.data.data as CourseResponse, response.data.message];
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  }

  // Upload file
  public async uploadFile(file: File): Promise<ApiResponse<string>> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await httpClient.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        code: response.data.code,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  // Lấy khóa học theo ID
  public async getCourseById(id: number): Promise<ApiResponse<CourseDetail>> {
    try {
      const response = await httpClient.get(`/courses?id=${id}`);
      return {
        code: response.data.code,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error fetching course by ID:", error);
      throw error;
    }
  }

  // Cập nhật khóa học
  public async updateCourse(id: number, courseData: CourseDetail): Promise<ApiResponse<string>> {
    try {
      const response = await httpClient.put(`/courses/update/${id}`, courseData);
      return {
        code: response.data.code,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  }

  // Xóa khóa học
  public async deleteCourse(id: number): Promise<ApiResponse<string>> {
    try {
      const response = await httpClient.delete(`/courses/delete/${id}`);
      return {
        code: response.data.code,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  }
}
