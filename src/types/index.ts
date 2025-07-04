export interface UserProgress {
  hadithId: number;
  memorized: boolean;
  lastReviewed: string;
  reviewCount: number;
  accuracy: number;
}

export interface Exercise {
  id: string;
  hadithId: number;
  type: 'full-text' | 'narrator-choice' | 'theme-choice';
  question: string;
  options?: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  exerciseNumber?: number;
}

export interface UserData {
  favorites: number[];
  progress: UserProgress[];
  totalScore: number;
  streak: number;
  lastStudyDate: string;
}