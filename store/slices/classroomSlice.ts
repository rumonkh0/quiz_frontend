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
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch classes"
      );
    }
  }
);

export const getStudentClasses = createAsyncThunk(
  "classroom/getStudentClasses",
  async (_, { rejectWithValue }) => {
    try {
      return await ClassroomService.getStudentClasses();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch student classes"
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to create class"
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch class"
      );
    }
  }
);

export const updateClass = createAsyncThunk(
  "classroom/updateClass",
  async (
    { id, classData }: { id: string; classData: { name: string } },
    { rejectWithValue }
  ) => {
    try {
      return await ClassroomService.updateClass(id, classData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update class"
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete class"
      );
    }
  }
);

export const joinClass = createAsyncThunk(
  "classroom/joinClass",
  async ({ classCode }: { classCode: string }, { rejectWithValue }) => {
    try {
      const response = await ClassroomService.joinClass(classCode);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to join class"
      );
    }
  }
);

export const removeStudentFromClass = createAsyncThunk(
  "classroom/removeStudentFromClass",
  async (
    { classroomId, studentId }: { classroomId: string; studentId: string },
    { rejectWithValue }
  ) => {
    try {
      await ClassroomService.removeStudent(classroomId, studentId);
      return studentId;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove student"
      );
    }
  }
);

export const leaveClass = createAsyncThunk(
  "classroom/leaveClass",
  async (classId: string, { rejectWithValue }) => {
    try {
      const data = await ClassroomService.leaveClass(classId);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to leave class"
      );
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
      // Get All Classes (Teacher)
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

      // Get All Classes (Student)
      .addCase(getStudentClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.data;
      })
      .addCase(getStudentClasses.rejected, (state, action) => {
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
        state.selectedClass = action.payload.data;
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
        const index = state.classes.findIndex(
          (cls) => cls._id === action.payload._id
        );
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
        state.classes = state.classes.filter(
          (cls) => cls._id !== action.payload
        );
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
        if (state.selectedClass) {
          state.selectedClass.students = state.selectedClass.students.filter(
            (student) => student._id !== action.payload
          );
        }
      })
      .addCase(removeStudentFromClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Leave Class
      .addCase(leaveClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveClass.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the class from the list of classes
        state.classes = state.classes.filter(
          (classItem) => classItem._id !== action.meta.arg
        );
      })
      .addCase(leaveClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default classroomSlice.reducer;
