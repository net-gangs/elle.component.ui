import { apiClient } from "@/lib/api-client";
import type { ApiResponse, PageResponseDto, PaginationParams } from "@/types/api";

export interface Chat {
  id: string;
  classroomId: string;
  title: string;
  focus?: string;
  tone?: string;
  pinned: boolean;
  // Lesson context fields
  lessonTopic?: string;
  gradeYear?: string;
  durationMinutes?: number;
  learningObjectives?: string;
  teachingActivities?: string;
  assessmentType?: string;
  targetCefrLevel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  lessonId?: string | null;
  lessonTitle?: string | null;
  lessonCreatedAt?: string | null;
}

export interface CreateChatDto {
  title: string;
  focus?: string;
  tone?: string;
  // Lesson context fields
  lessonTopic?: string;
  gradeYear?: string;
  durationMinutes?: number;
  learningObjectives?: string;
  teachingActivities?: string;
  assessmentType?: string;
  targetCefrLevel?: string;
}

export interface UpdateChatDto {
  title?: string;
  focus?: string;
  tone?: string;
  pinned?: boolean;
  // Lesson context fields
  lessonTopic?: string;
  gradeYear?: string;
  durationMinutes?: number;
  learningObjectives?: string;
  teachingActivities?: string;
  assessmentType?: string;
  targetCefrLevel?: string;
}

export interface SendMessageDto {
  content: string;
}

export interface ChatWithMessages extends Chat {
  messages: ChatMessage[];
}

export type StreamEvent =
  | {
    type: "chunk";
    content: string;
  }
  | {
    type: "done";
    stopReason: string | null;
    savedMessageId: string;
  }
  | {
    type: "error";
    message: string;
  };

// CEFR levels for selection
export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

// Assessment types for selection
export const ASSESSMENT_TYPES = [
  "Quiz",
  "Written Test",
  "Oral Presentation",
  "Project",
  "Portfolio",
  "Peer Assessment",
  "Self Assessment",
  "Other",
] as const;
export type AssessmentType = (typeof ASSESSMENT_TYPES)[number];

export const chatService = {
  /**
   * Get all chats for a classroom with pagination
   */
  getAll: async (
    classroomId: string,
    params?: PaginationParams
  ): Promise<PageResponseDto<Chat>> => {
    const response = await apiClient.get<
      never,
      ApiResponse<PageResponseDto<Chat>>
    >(`/classrooms/${classroomId}/chats`, { params });
    return response.data;
  },

  /**
   * Get a chat by ID with messages
   */
  getById: async (classroomId: string, id: string): Promise<ChatWithMessages> => {
    const response = await apiClient.get<never, ApiResponse<ChatWithMessages>>(
      `/classrooms/${classroomId}/chats/${id}`
    );
    return response.data;
  },

  /**
   * Create a new chat in a classroom
   */
  create: async (classroomId: string, data: CreateChatDto): Promise<Chat> => {
    const response = await apiClient.post<never, ApiResponse<Chat>>(
      `/classrooms/${classroomId}/chats`,
      data
    );
    return response.data;
  },

  /**
   * Update a chat
   */
  update: async (
    classroomId: string,
    id: string,
    data: UpdateChatDto
  ): Promise<Chat> => {
    const response = await apiClient.patch<never, ApiResponse<Chat>>(
      `/classrooms/${classroomId}/chats/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a chat (soft delete)
   */
  delete: async (classroomId: string, id: string): Promise<void> => {
    await apiClient.delete(`/classrooms/${classroomId}/chats/${id}`);
  },

  /**
   * Send a message to a chat and receive response via SSE
   */
  sendMessageSSE: (
    classroomId: string,
    chatId: string,
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: (fullMessage: string, stopReason: string | null, savedMessageId: string) => void,
    onError: (error: Error) => void
  ): AbortController => {
    const abortController = new AbortController();
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
    const token = localStorage.getItem("access_token");

    const eventSource = new EventSource(
      `${baseUrl}/classrooms/${classroomId}/chats/${chatId}/messages/stream?message=${encodeURIComponent(message)}&token=${token}`,
    );

    let fullMessage = "";

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as StreamEvent;

        if (data.type === "chunk") {
          fullMessage += data.content;
          onChunk(data.content);
        } else if (data.type === "done") {
          eventSource.close();
          onComplete(fullMessage, data.stopReason || null, data.savedMessageId);
        } else if (data.type === "error") {
          eventSource.close();
          onError(new Error(data.message));
        }
      } catch {
        // Raw text chunk
        fullMessage += event.data;
        onChunk(event.data);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      onError(new Error("SSE connection error"));
    };

    abortController.signal.addEventListener("abort", () => {
      eventSource.close();
    });

    return abortController;
  },

  /**
   * Send a message to a chat (non-streaming)
   */
  sendMessage: async (
    classroomId: string,
    chatId: string,
    data: SendMessageDto
  ): Promise<ChatMessage> => {
    const response = await apiClient.post<never, ApiResponse<ChatMessage>>(
      `/classrooms/${classroomId}/chats/${chatId}/messages`,
      data
    );
    return response.data;
  },

  /**
   * Get messages for a chat
   */
  getMessages: async (
    classroomId: string,
    chatId: string,
    params?: PaginationParams
  ): Promise<PageResponseDto<ChatMessage>> => {
    const response = await apiClient.get<
      never,
      ApiResponse<PageResponseDto<ChatMessage>>
    >(`/classrooms/${classroomId}/chats/${chatId}/messages`, { params });

    return response.data;
  },

  /**
   * Save chat message to lesson
   */
  saveToLesson: async (
    classroomId: string,
    chatId: string,
    messageId: string,
    lessonId?: string
  ): Promise<{ lessonId: string; lessonTitle: string; messageId: string }> => {
    const response = await apiClient.post<
      never,
      ApiResponse<{ lessonId: string; lessonTitle: string; messageId: string }>
    >(`/classrooms/${classroomId}/chats/${chatId}/messages/${messageId}/save-to-lesson`, {
      lessonId,
    });
    return response.data;
  },

  removeSavedLesson: async (
    classroomId: string,
    chatId: string,
    messageId: string
  ): Promise<{ removedLessonId?: string }> => {
    const response = await apiClient.delete<
      never,
      ApiResponse<{ removedLessonId?: string }>
    >(`/classrooms/${classroomId}/chats/${chatId}/messages/${messageId}/save-to-lesson`);
    return response.data;
  },
};
