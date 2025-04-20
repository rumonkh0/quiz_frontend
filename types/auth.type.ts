export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    gradeLevel?: string;
    subjectExpertise?: string[];
    classrooms?: string[];
    createdAt: Date;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'student' | 'teacher' | 'admin';
  }

  export interface LoginCredentials {
    email: string;
    password: string;
    role: 'student' | 'teacher' | 'admin';
  }