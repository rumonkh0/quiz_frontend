export interface Classroom {
    _id: string;
    name: string;
    code: string;
    studentsCount: number;
    quizzesCount: number;
    teacherId: string;
    createdAt: string;
  }
  
  export interface ClassroomState {
    classes: Classroom[];
    loading: boolean;
    selectedClass: Classroom | null;
    error: string | null;
  }

  