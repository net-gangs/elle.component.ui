import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classroomService } from "@/services/class-service";
import { queryKeys } from "@/lib/query-keys";
import type {
  Classroom,
  CreateClassroomDto,
  UpdateClassroomDto,
} from "@/types/classroom";
import type { PaginationParams, PageResponseDto } from "@/types/api";

/**
 * Hook to fetch paginated list of classrooms
 */
export function useClassrooms(params?: PaginationParams) {
  return useQuery<PageResponseDto<Classroom>>({
    queryKey: queryKeys.classrooms.list(params),
    queryFn: () => classroomService.getAll(params),
  });
}

/**
 * Hook to fetch a single classroom by ID
 */
export function useClassroom(id: string | undefined) {
  return useQuery<Classroom>({
    queryKey: queryKeys.classrooms.detail(id!),
    queryFn: () => classroomService.getById(id!),
    enabled: !!id,
  });
}

/**
 * Hook to create a new classroom
 */
export function useCreateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassroomDto) => classroomService.create(data),
    onSuccess: () => {
      // Invalidate all classroom lists to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.classrooms.lists(),
      });
    },
  });
}

/**
 * Hook to update a classroom
 */
export function useUpdateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassroomDto }) =>
      classroomService.update(id, data),
    onSuccess: (updatedClassroom) => {
      queryClient.setQueryData(
        queryKeys.classrooms.detail(updatedClassroom.id),
        updatedClassroom
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.classrooms.lists(),
      });
    },
  });
}

/**
 * Hook to delete a classroom
 */
export function useDeleteClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classroomService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.classrooms.detail(deletedId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.classrooms.lists(),
      });
    },
  });
}
