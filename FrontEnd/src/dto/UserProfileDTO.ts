export interface UserProfileDTO {
  id: number;
  username: string;
  fullname: string;
  email: string;
  avatar: string;
  position: string | null;
  phone: string;
  majors: string[];
  role: string;
  createDate: string;
}
