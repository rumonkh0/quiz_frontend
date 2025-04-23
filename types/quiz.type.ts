export interface Quiz {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data(data: any): unknown;
  _id: string;
  title: string;
  classroom: string;
  isActive: boolean;
  startsOn: Date;
  duration: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizSubmission {
  quizId: string;
  answers: { [questionId: string]: string };
}

export interface Classroom {
  _id: string;
  name: string;
  classCode: string;
  teacher: string;
  students: string[];
  quizzes: string[];
}

export interface LeaderboardEntry {
  student: {
    _id: string;
    name: string;
    email: string;
  };
  score: number;
  totalCorrect: number;
  totalQuestions: number;
}
