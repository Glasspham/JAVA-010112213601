export class ProgramSearch {
  keyword?: string | null;
  status?: string | null;
  date?: string | null; // format YYYY-MM-DD
  page: number = 1;
  limit: number = 5;
  timer: number = 0;
}
