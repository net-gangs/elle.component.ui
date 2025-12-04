import { apiClient } from "@/lib/api-client";
import type {
  Student,
  CreateStudentDto,
  UpdateStudentDto,
} from "@/types/classroom";
import type { ApiResponse, PageResponseDto, PaginationParams } from "@/types/api";

export const studentService = {
  /**
   * Get all students for a classroom with pagination
   */
  getAll: async (
    classroomId: string,
    params?: PaginationParams
  ): Promise<PageResponseDto<Student>> => {
    const response = await apiClient.get<
      never,
      ApiResponse<PageResponseDto<Student>>
    >(`/classrooms/${classroomId}/students`, { params });
    return response.data;
  },

  /**
   * Get a student by ID
   */
  getById: async (classroomId: string, id: string): Promise<Student> => {
    const response = await apiClient.get<never, ApiResponse<Student>>(
      `/classrooms/${classroomId}/students/${id}`
    );
    return response.data;
  },

  /**
   * Create a new student in a classroom
   */
  create: async (
    classroomId: string,
    data: CreateStudentDto
  ): Promise<Student> => {
    const response = await apiClient.post<never, ApiResponse<Student>>(
      `/classrooms/${classroomId}/students`,
      data
    );
    return response.data;
  },

  /**
   * Update a student
   */
  update: async (
    classroomId: string,
    id: string,
    data: UpdateStudentDto
  ): Promise<Student> => {
    const response = await apiClient.patch<never, ApiResponse<Student>>(
      `/classrooms/${classroomId}/students/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a student (soft delete)
   */
  delete: async (classroomId: string, id: string): Promise<void> => {
    await apiClient.delete(`/classrooms/${classroomId}/students/${id}`);
  },
};
