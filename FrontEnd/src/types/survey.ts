export type SurveyType = 'ASSIST' | 'CRAFFT' | 'CUSTOM';
export type RiskLevel = 'low' | 'moderate' | 'high';

export interface SurveyQuestion {
  id: string;
  text: string;
  options: string[];
  scores: number[]; // Score for each option
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  type: SurveyType;
  questions: SurveyQuestion[];
  createdAt: Date;
  updatedAt: Date;
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
