import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ClassroomService } from "@/services/classroom.service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Classroom, ClassroomState } from "@/types/classroom.type";

const initialState: ClassroomState = {
  classes: [],
  selectedClass: null,
  loading: false,
  error: null,
};

// Thunks

export const getTeacherClasses = createAsyncThunk(
  "classroom/getTeacherClasses",
  async (_, { rejectWithValue }) => {
    try {
      return await ClassroomService.getTeacherClasses();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch classes");
    }
  }
);

export const createClass = createAsyncThunk(
  "classroom/createClass",
  async (classData: { name: string }, { rejectWithValue }) => {
    try {
      return await ClassroomService.createClass(classData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create class");
    }
  }
);

export const getClassById = createAsyncThunk(
  "classroom/getClassById",
  async (classId: string, { rejectWithValue }) => {
    try {
      return await ClassroomService.getClassById(classId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch class");
    }
  }
);

export const updateClass = createAsyncThunk(
  "classroom/updateClass",
  async ({ id, classData }: { id: string; classData: { name: string } }, { rejectWithValue }) => {
    try {
      return await ClassroomService.updateClass(id, classData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update class");
    }
  }
);

export const deleteClass = createAsyncThunk(
  "classroom/deleteClass",
  async (id: string, { rejectWithValue }) => {
    try {
      await ClassroomService.deleteClass(id);
      return id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete class");
    }
  }
);

export const joinClass = createAsyncThunk(
  "classroom/joinClass",
  async ({ classCode }: { classCode: string }, { rejectWithValue }) => {
    try {
      return await ClassroomService.joinClass(classCode);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to join class");
    }
  }
);

export const removeStudentFromClass = createAsyncThunk(
  "classroom/removeStudentFromClass",
  async ({ id, studentId }: { id: string; studentId: string }, { rejectWithValue }) => {
    try {
      return await ClassroomService.removeStudent(id, studentId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove student");
    }
  }
);

// Slice

const classroomSlice = createSlice({
  name: "classroom",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Classes
      .addCase(getTeacherClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeacherClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.data;
      })
      .addCase(getTeacherClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Class
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes.push(action.payload.data);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Class by ID
      .addCase(getClassById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClass = action.payload;
      })
      .addCase(getClassById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Class
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.classes.findIndex((cls) => cls.id === action.payload._id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Class
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.filter((cls) => cls.id !== action.payload);
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Join Class
      .addCase(joinClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes.push(action.payload);
      })
      .addCase(joinClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove Student
      .addCase(removeStudentFromClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .addCase(removeStudentFromClass.fulfilled, (state, action) => {
        state.loading = false;
        // if (state.selectedClass) {
        //   state.selectedClass.students = state.selectedClass.students.filter(
        //     (student) => student.id !== action.payload.studentId
        //   );
        // }
      })
      .addCase(removeStudentFromClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default classroomSlice.reducer;
