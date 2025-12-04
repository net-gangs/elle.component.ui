import { apiClient } from "@/lib/api-client";
import type {
  Lesson,
  CreateLessonDto,
  UpdateLessonDto,
} from "@/types/classroom";
import type { ApiResponse, PageResponseDto, PaginationParams } from "@/types/api";

export const lessonService = {
  /**
   * Get all lessons for a classroom with pagination
   */
  getAll: async (
    classroomId: string,
    params?: PaginationParams
  ): Promise<PageResponseDto<Lesson>> => {
    const response = await apiClient.get<
      never,
      ApiResponse<PageResponseDto<Lesson>>
    >(`/classrooms/${classroomId}/lessons`, { params });
    return response.data;
  },

  /**
   * Get a lesson by ID
   */
  getById: async (classroomId: string, id: string): Promise<Lesson> => {
    const response = await apiClient.get<never, ApiResponse<Lesson>>(
      `/classrooms/${classroomId}/lessons/${id}`
    );
    return response.data;
  },

  /**
   * Create a new lesson in a classroom
   */
  create: async (
    classroomId: string,
    data: CreateLessonDto
  ): Promise<Lesson> => {
    const response = await apiClient.post<never, ApiResponse<Lesson>>(
      `/classrooms/${classroomId}/lessons`,
      data
    );
    return response.data;
  },

  /**
   * Update a lesson
   */
  update: async (
    classroomId: string,
    id: string,
    data: UpdateLessonDto
  ): Promise<Lesson> => {
    const response = await apiClient.patch<never, ApiResponse<Lesson>>(
      `/classrooms/${classroomId}/lessons/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a lesson (soft delete)
   */
  delete: async (classroomId: string, id: string): Promise<void> => {
    await apiClient.delete(`/classrooms/${classroomId}/lessons/${id}`);
  },
};
