export interface Classroom {
  _id: string;
  name: string;
  code: string;
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  completedQuizzes: number;
}
  export interface ClassroomState {
    classes: Classroom[];
    loading: boolean;
    selectedClass: Classroom | null;
    error: string | null;
  }

  