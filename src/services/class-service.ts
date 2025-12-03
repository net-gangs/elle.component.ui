import { apiClient } from "@/lib/api-client";
import type {
  Classroom,
  CreateClassroomDto,
  UpdateClassroomDto,
} from "@/types/classroom";
import type { ApiResponse, PageResponseDto, PaginationParams } from "@/types/api";

export const classroomService = {
  /**
   * Get all classrooms for the current user with pagination
   */
  getAll: async (
    params?: PaginationParams
  ): Promise<PageResponseDto<Classroom>> => {
    const response = await apiClient.get<
      never,
      ApiResponse<PageResponseDto<Classroom>>
    >("/classrooms", { params });
    return response.data;
  },

  /**
   * Get a classroom by ID
   */
  getById: async (id: string): Promise<Classroom> => {
    const response = await apiClient.get<never, ApiResponse<Classroom>>(
      `/classrooms/${id}`
    );
    return response.data;
  },

  /**
   * Create a new classroom
   */
  create: async (data: CreateClassroomDto): Promise<Classroom> => {
    const response = await apiClient.post<never, ApiResponse<Classroom>>(
      "/classrooms",
      data
    );
    return response.data;
  },

  /**
   * Update a classroom
   */
  update: async (id: string, data: UpdateClassroomDto): Promise<Classroom> => {
    const response = await apiClient.patch<never, ApiResponse<Classroom>>(
      `/classrooms/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a classroom (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/classrooms/${id}`);
  },
};