export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Lecture {
  id: string;
  title: string;
  date: string;
  duration: number; // seconds
  quizScore?: number;
  nextReviewDate?: string;
  hasTranscript: boolean;
  hasSummary: boolean;
  fileType: 'audio' | 'pdf';
}

export interface TranscriptSegment {
  id: string;
  timestamp: number; // seconds
  text: string;
}

export interface SummarySection {
  heading: string;
  points: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizAttempt {
  lectureId: string;
  score: number;
  total: number;
  date: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  nextReview: string;
  difficulty: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface LectureDetail {
  lecture: Lecture;
  transcript: TranscriptSegment[];
  summary: SummarySection[];
  notes: string;
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  audioUrl?: string;
}
