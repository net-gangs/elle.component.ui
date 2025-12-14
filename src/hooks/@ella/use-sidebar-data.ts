import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { chatService } from "@/services/chat-service";
import { queryKeys } from "@/lib/query-keys";
import { useClassrooms } from "./use-classrooms";
import type { LessonClass, LessonChat } from "@/stores/lesson-store";

export function useSidebarData() {
  const { data: classroomsData, isLoading: isClassesLoading } = useClassrooms();

  const classrooms = useMemo(
    () => classroomsData?.data ?? [],
    [classroomsData],
  );

  const chatQueries = useQueries({
    queries: classrooms.map((classroom) => ({
      queryKey: queryKeys.chats.list(classroom.id),
      queryFn: async () => {
        const res = await chatService.getAll(classroom.id, { limit: 50 });
        return res.data;
      },
    })),
  });

  const combinedClasses: LessonClass[] = useMemo(() => {
    return classrooms.map((classroom, index) => {
      const chats = chatQueries[index]?.data || [];
      const mappedChats: LessonChat[] = chats.map((chat) => ({
        ...chat,
        messages: [],
      }));

      return {
        id: classroom.id,
        name: classroom.name,
        grade: classroom.grade,
        totalStudents: classroom.totalStudents,
        pinned: classroom.pinned,
        chats: mappedChats,
        createdAt: classroom.createdAt,
        updatedAt: classroom.updatedAt,
      };
    });
  }, [classrooms, chatQueries]);

  const isLoading = isClassesLoading || chatQueries.some((q) => q.isLoading);

  return { data: combinedClasses, isLoading };
}
