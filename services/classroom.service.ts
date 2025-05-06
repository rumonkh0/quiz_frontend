import api from "@/lib/api/axios";

export const ClassroomService = {
  // GET /classes -> Get all classes for teacher
  getTeacherClasses: async () => {
    const response = await api.get("/classrooms");
    return response.data;
  },

  // GET /classrooms/student -> Get all classes for student
  getStudentClasses: async () => {
    const response = await api.get("/classrooms/student");
    return response.data;
  },

  // POST /classrooms -> Create a new class
  createClass: async (classData: { name: string }) => {
    const response = await api.post("/classrooms", classData);
    return response.data;
  },

  // GET /classrooms/:id -> Get single class by id
  getClassById: async (id: string) => {
    const response = await api.get(`/classrooms/${id}`);
    return response.data;
  },

  // PUT /classrooms/:id -> Update a class
  updateClass: async (id: string, classData: { name: string }) => {
    const response = await api.put(`/classrooms/${id}`, classData);
    return response.data;
  },

  // DELETE /classrooms/:id -> Delete a class
  deleteClass: async (id: string) => {
    const response = await api.delete(`/classrooms/${id}`);
    return response.data;
  },

  // POST /classrooms/join -> Join a class (students)
  joinClass: async (classCode: string) => {
    const response = await api.post("/classrooms/join", { code: classCode });
    return response.data;
  },

  // PUT /classrooms/:id/remove-student -> Remove a student from class
  removeStudent: async (id: string, studentId: string) => {
    const response = await api.put(`/classrooms/${id}/remove-student`, {
      studentId,
    });
    return response.data;
  },

  // POST /classrooms/:id/leave -> Leave a class (students)
  leaveClass: async (classId: string) => {
    const response = await api.post(`/classrooms/${classId}/leave`);
    return response.data;
  },
};
