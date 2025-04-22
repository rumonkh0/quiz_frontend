export interface Quiz {
    _id: string;
    title: string;
    duration: number;
    classroom: string;
    questions: Question[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Question {
    _id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
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