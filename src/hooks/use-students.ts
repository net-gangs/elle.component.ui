import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/student-service";
import { queryKeys } from "@/lib/query-keys";
import type {
  Student,
  CreateStudentDto,
  UpdateStudentDto,
} from "@/types/classroom";
import type { PaginationParams, PageResponseDto } from "@/types/api";

/**
 * Hook to fetch paginated list of students for a classroom
 */
export function useStudents(
  classroomId: string | undefined,
  params?: PaginationParams
) {
  return useQuery<PageResponseDto<Student>>({
    queryKey: queryKeys.students.list(classroomId!, params),
    queryFn: () => studentService.getAll(classroomId!, params),
    enabled: !!classroomId,
  });
}

/**
 * Hook to fetch a single student by ID
 */
export function useStudent(
  classroomId: string | undefined,
  id: string | undefined
) {
  return useQuery<Student>({
    queryKey: queryKeys.students.detail(classroomId!, id!),
    queryFn: () => studentService.getById(classroomId!, id!),
    enabled: !!classroomId && !!id,
  });
}

/**
 * Hook to create a new student
 */
export function useCreateStudent(classroomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentDto) =>
      studentService.create(classroomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.students.lists(),
      });
    },
  });
}

/**
 * Hook to update a student
 */
export function useUpdateStudent(classroomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentDto }) =>
      studentService.update(classroomId, id, data),
    onSuccess: (updatedStudent) => {
      queryClient.setQueryData(
        queryKeys.students.detail(classroomId, updatedStudent.id),
        updatedStudent
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.students.lists(),
      });
    },
  });
}

/**
 * Hook to delete a student
 */
export function useDeleteStudent(classroomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentService.delete(classroomId, id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.students.detail(classroomId, deletedId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.students.lists(),
      });
    },
  });
}
