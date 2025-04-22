import api from '@/lib/api/axios';

export const QuizService = {
  createQuiz: async (quizData: {
    title: string;
    duration: number;
    classroomId: string;
    // questions: number;
  }) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },

  getClassQuizzes: async (classroomId: string) => {
    const response = await api.get(`/quizzes/classroom/${classroomId}`);
    return response.data;
  },

  getQuizDetails: async (quizId: string) => {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  },

  updateQuiz: async (quizId: string, updateData: {
    title?: string;
    duration?: number;
    isActive?: boolean;
  }) => {
    const response = await api.put(`/quizzes/${quizId}`, updateData);
    return response.data;
  },

  deleteQuiz: async (quizId: string) => {
    const response = await api.delete(`/quizzes/${quizId}`);
    return response.data;
  },

  getLeaderboard: async (quizId: string) => {
    const response = await api.get(`/quizzes/${quizId}/leaderboard`);
    return response.data;
  }
};