export type SurveyType = 'ASSIST' | 'CRAFFT' | 'CUSTOM';
export type RiskLevel = 'low' | 'moderate' | 'high';

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

export interface SurveyQuestion {
  id: string;
  text: string;
  options: string[];
  scores: number[]; // Score for each option
}

export interface SurveyResponse {
  id: string;
  userId: string;
  surveyId: string;
  answers: {
    questionId: string;
    selectedOption: number;
    score: number;
  }[];
  totalScore: number;
  riskLevel: RiskLevel;
  recommendations: string[];
  completedAt: Date;
}
