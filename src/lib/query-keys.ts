import type { PaginationParams } from "@/types/api";

/**
 * Query keys for React Query cache management
 * Centralized location for all query keys to make invalidation easier
 */
export const queryKeys = {
  // Classrooms
  classrooms: {
    all: ["classrooms"] as const,
    lists: () => [...queryKeys.classrooms.all, "list"] as const,
    list: (params?: PaginationParams) =>
      [...queryKeys.classrooms.lists(), params] as const,
    details: () => [...queryKeys.classrooms.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.classrooms.details(), id] as const,
  },

  // Students
  students: {
    all: ["students"] as const,
    lists: () => [...queryKeys.students.all, "list"] as const,
    list: (classroomId: string, params?: PaginationParams) =>
      [...queryKeys.students.lists(), classroomId, params] as const,
    details: () => [...queryKeys.students.all, "detail"] as const,
    detail: (classroomId: string, id: string) =>
      [...queryKeys.students.details(), classroomId, id] as const,
  },

  // Lessons
  lessons: {
    all: ["lessons"] as const,
    lists: () => [...queryKeys.lessons.all, "list"] as const,
    list: (classroomId: string, params?: PaginationParams) =>
      [...queryKeys.lessons.lists(), classroomId, params] as const,
    details: () => [...queryKeys.lessons.all, "detail"] as const,
    detail: (classroomId: string, id: string) =>
      [...queryKeys.lessons.details(), classroomId, id] as const,
  },

  // Assessments
  assessments: {
    all: ["assessments"] as const,
    lists: () => [...queryKeys.assessments.all, "list"] as const,
    list: (classroomId: string, studentId: string, params?: PaginationParams) =>
      [...queryKeys.assessments.lists(), classroomId, studentId, params] as const,
    details: () => [...queryKeys.assessments.all, "detail"] as const,
    detail: (classroomId: string, studentId: string, id: string) =>
      [...queryKeys.assessments.details(), classroomId, studentId, id] as const,
  },
};
