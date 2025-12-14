import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService, type CreateChatDto } from "@/services/chat-service";
import { queryKeys } from "@/lib/query-keys";
import type { PaginationParams, PageResponseDto } from "@/types/api";
import type { Chat } from "@/types/chat";

/**
 * Hook to fetch paginated list of chats for a specific classroom
 */
export function useChats(
  classroomId: string | undefined,
  params?: PaginationParams,
) {
  return useQuery<PageResponseDto<Chat>>({
    queryKey: queryKeys.chats.list(classroomId!, params),
    queryFn: () => chatService.getAll(classroomId!, params),
    enabled: !!classroomId,
  });
}

export function useChat(classroomId: string | null, chatId: string | null) {
  return useQuery<Chat>({
    queryKey: queryKeys.chats.detail(classroomId!, chatId!),
    queryFn: () => chatService.getById(classroomId!, chatId!),
    enabled: !!classroomId && !!chatId,
  });
}

export function useToggleChatPin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, chat }: { classId: string; chat: Chat }) =>
      chatService.update(classId, chat.id, {
        pinned: !chat.pinned,
      }),

    onMutate: async ({ classId, chat }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.chats.list(classId),
      });

      const previousChats = queryClient.getQueryData<PageResponseDto<Chat>>(
        queryKeys.chats.list(classId),
      );

      if (previousChats) {
        queryClient.setQueryData<PageResponseDto<Chat>>(
          queryKeys.chats.list(classId),
          {
            ...previousChats,
            data: previousChats.data.map((c) =>
              c.id === chat.id ? { ...c, pinned: !chat.pinned } : c,
            ),
          },
        );
      }
      return { previousChats };
    },
    onError: (_err, { classId }, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(
          queryKeys.chats.list(classId),
          context.previousChats,
        );
      }
    },

    onSettled: (_data, _error, { classId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.list(classId),
      });
    },
  });
}

export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, data }: { classId: string; data: CreateChatDto }) =>
      chatService.create(classId, data),

    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.list(classId),
      });
    },
  });
}
