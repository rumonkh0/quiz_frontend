import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { QuizService } from "@/services/quiz.service";

import { Quiz, LeaderboardEntry } from "@/types/quiz.type";

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  leaderboard: [],
  loading: false,
  error: null,
};

// Update async thunks with proper types
export const fetchClassQuizzes = createAsyncThunk<Quiz[], string>(
  "quiz/fetchClassQuizzes",
  async (classroomId: string, { rejectWithValue }) => {
    try {
      const response = await QuizService.getClassQuizzes(classroomId);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch quizzes"
      );
    }
  }
);

export const createNewQuiz = createAsyncThunk<
  Quiz,
  {
    classroomId: string;
    title: string;
    duration: number;
    startsOn: Date;
    isActive: boolean;
    // questions: number;
  }
>("quiz/create", async (quizData, { rejectWithValue }) => {
  try {
    return await QuizService.createQuiz(quizData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create quiz"
    );
  }
});

export const fetchQuizDetails = createAsyncThunk(
  "quiz/fetchDetails",
  async (quizId: string, { rejectWithValue }) => {
    try {
      return await QuizService.getQuizDetails(quizId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch quiz details"
      );
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.quizzes = [];
      })
      .addCase(fetchClassQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchClassQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createNewQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewQuiz.fulfilled, (state, action) => {
        state.loading = false;
        const newQuiz = action.payload;
        state.quizzes.push(newQuiz);
      })
      .addCase(createNewQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQuizDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default quizSlice.reducer;
