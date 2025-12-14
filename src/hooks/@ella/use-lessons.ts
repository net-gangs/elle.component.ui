import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonService } from "@/services/lesson-service";
import { queryKeys } from "@/lib/query-keys";
import type {
  Lesson,
  CreateLessonDto,
  UpdateLessonDto,
} from "@/types/classroom";
import type { PaginationParams, PageResponseDto } from "@/types/api";

/**
 * Hook to fetch paginated list of lessons for a classroom
 */
export function useLessons(
  classroomId: string | undefined,
  params?: PaginationParams
) {
  return useQuery<PageResponseDto<Lesson>>({
    queryKey: queryKeys.lessons.list(classroomId!, params),
    queryFn: () => lessonService.getAll(classroomId!, params),
    enabled: !!classroomId,
  });
}

/**
 * Hook to fetch a single lesson by ID
 */
export function useLesson(
  classroomId: string | undefined,
  id: string | undefined
) {
  return useQuery<Lesson>({
    queryKey: queryKeys.lessons.detail(classroomId!, id!),
    queryFn: () => lessonService.getById(classroomId!, id!),
    enabled: !!classroomId && !!id,
  });
}

/**
 * Hook to create a new lesson
 */
export function useCreateLesson(classroomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLessonDto) =>
      lessonService.create(classroomId, data),
    onSuccess: () => {
    
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.lists(),
      });
    },
  });
}

/**
 * Hook to update a lesson
 */
export function useUpdateLesson(classroomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonDto }) =>
      lessonService.update(classroomId, id, data),
    onSuccess: (updatedLesson) => {
      queryClient.setQueryData(
        queryKeys.lessons.detail(classroomId, updatedLesson.id),
        updatedLesson
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.lists(),
      });
    },
  });
}

/**
 * Hook to delete a lesson
 */
export function useDeleteLesson(classroomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lessonService.delete(classroomId, id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.lessons.detail(classroomId, deletedId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.lists(),
      });
    },
  });
}
