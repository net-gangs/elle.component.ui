import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/services/chat-service";
import { queryKeys } from "@/lib/query-keys";

export const useChatMessages = (
  classId?: string | null,
  chatId?: string | null,
) => {
  return useQuery({
    queryKey: queryKeys.chats.messages(classId, chatId),
    enabled: !!classId && !!chatId,
    queryFn: async () => {
      const response = await chatService.getMessages(classId!, chatId!);

      return response.data.map((msg) => ({
        id: msg.id,
        role:
          msg.role === "user" ? ("teacher" as const) : ("assistant" as const),
        content: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: msg.createdAt,
        lessonId: msg.lessonId ?? null,
        lessonTitle: msg.lessonTitle ?? null,
        lessonCreatedAt: msg.lessonCreatedAt ?? null,
      }));
    },
  });
};
