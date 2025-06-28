export type SurveyType = 'FEEDBACK' | 'ASSESSMENT' | 'POLL' | 'CUSTOM';

export interface Answer {
  id: number | null;
  content: string;
  correct: boolean;
}

export interface Question {
  id: number | null;
  content: string;
  answers: Answer[];
}

export interface Survey {
  id: number | null;
  name: string;
  type: string;
  questions: Question[];
}

export interface SurveySearch {
  page: number;
  limit: number;
  keyword?: string;
  type?: string;
}

export interface PaginatedSurveyResponse {
  content: Survey[];
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
  totalPages: number;
  totalElements: number;
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

export interface ApiResponse<T> {
  code: number;
  message: string | null;
  data: T;
}

export interface SurveyMark {
  id: number;
  fullname: string;
  surveyName: string | null;
  mark: number;
  createDate: string;
}
