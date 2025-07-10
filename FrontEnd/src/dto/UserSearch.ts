export class UserSearch {
  keyword?: string | null;
  roleName?: string | null;
  majorName?: string | "";
  page: number = 1;
  limit: number = 5;
  timer: number = 0;
}
