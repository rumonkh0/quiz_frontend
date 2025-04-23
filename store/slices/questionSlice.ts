import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api/axios";
import { Question } from "@/types/quiz.type";

/* ------------------------------------------------------------------ */
/* STATE TYPES                                                        */
/* ------------------------------------------------------------------ */
interface QuestionState {
  /**
   * Questions segmented by quiz‑id so components can safely
   * select `state.question.questions[quizId]`.
   */
  questions: Question[];
  loading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  questions: [],
  loading: false,
  error: null,
};

/* ------------------------------------------------------------------ */
/* ASYNC THUNKS                                                       */
/* ------------------------------------------------------------------ */
export const createQuestion = createAsyncThunk(
  "question/create",
  async (
    questionData: Omit<Question, "_id"> & { quiz: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/questions", questionData);
      return response.data.data as Question & { quiz: string };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create question"
      );
    }
  }
);

export const updateQuestion = createAsyncThunk(
  "question/update",
  async (
    {
      id,
      questionData,
    }: { id: string; questionData: Partial<Question> & { quiz?: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/questions/${id}`, questionData);
      return response.data.data as Question & { quiz: string };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update question"
      );
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  "question/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/questions/${id}`);
      return id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete question"
      );
    }
  }
);

export const getQuestionsByQuiz = createAsyncThunk(
  "question/getByQuiz",
  async (quizId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/questions/quiz/${quizId}`);
      return { quizId, data: response.data.data as Question[] };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch questions"
      );
    }
  }
);

/* ------------------------------------------------------------------ */
/* SLICE                                                               */
/* ------------------------------------------------------------------ */
const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* --------------------------- CREATE ---------------------------- */
    builder
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createQuestion.fulfilled,
        (state, action: PayloadAction<Question & { quiz: string }>) => {
          state.loading = false;
          // const { quiz } = action.payload;
          if (!state.questions) state.questions = [];
          state.questions.push(action.payload);
        }
      )
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    /* --------------------------- UPDATE ---------------------------- */
    builder
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateQuestion.fulfilled,
        (state, action: PayloadAction<Question & { quiz: string }>) => {
          state.loading = false;
          if (!state.questions) return;
          const idx = state.questions.findIndex(
            (q) => q._id === action.payload._id
          );
          if (idx !== -1) {
            state.questions[idx] = action.payload;
          }
        }
      )
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    /* --------------------------- DELETE ---------------------------- */
    builder
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteQuestion.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.questions = state.questions.filter(
            (q) => q._id !== action.payload
          );
        }
      )
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    /* --------------------- GET QUESTIONS BY QUIZ ------------------- */
    builder
      .addCase(getQuestionsByQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getQuestionsByQuiz.fulfilled,
        (
          state,
          action: PayloadAction<{ quizId: string; data: Question[] }>
        ) => {
          state.loading = false;
          state.questions = action.payload.data;
        }
      )
      .addCase(getQuestionsByQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default questionSlice.reducer;
