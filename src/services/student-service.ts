import { apiClient } from "@/lib/api-client";

export type CefrLevels = {
  reading?: string;
  writing?: string;
  speaking?: string;
  listening?: string;
};

export type CreateStudentDto = {
  fullName: string;
  grade?: string;
  hobby?: string;
  notes?: string;
  currentLevel?: string;
  avatarUrl?: string;
  specialNeeds?: string[];
  cefrLevels?: CefrLevels | null;
};

export type UpdateStudentDto = Partial<CreateStudentDto>;

export const studentService = {
  getByClass: (classId: string) => {
    return apiClient.get(`/classrooms/${classId}/students`);
  },

  create: (classId: string, data: CreateStudentDto) => {
    return apiClient.post(`/classrooms/${classId}/students`, data);
  },

  update: (classId: string, studentId: string, data: UpdateStudentDto) => {
    return apiClient.patch(`/classrooms/${classId}/students/${studentId}`, data);
  },

  delete: (classId: string, studentId: string) => {
    return apiClient.delete(`/classrooms/${classId}/students/${studentId}`);
  },
};