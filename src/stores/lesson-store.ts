import { Store } from '@tanstack/react-store';

export interface LessonChatMessage {
  id: string;
  role: "teacher" | "assistant";
  content: string;
  timestamp: string;
  createdAt?: string;
  lessonId?: string | null;
  lessonTitle?: string | null;
  lessonCreatedAt?: string | null;
}

export interface LessonChat {
  id: string;
  classroomId: string;
  title: string;
  focus?: string;
  tone?: string;
  pinned?: boolean;
  lastActivity?: string;
  messages: LessonChatMessage[];
  // Lesson context fields
  lessonTopic?: string;
  gradeYear?: string;
  durationMinutes?: number;
  learningObjectives?: string;
  teachingActivities?: string;
  assessmentType?: string;
  targetCefrLevel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LessonClass {
  id: string;
  name: string;
  grade?: string;
  totalStudents?: number;
  pinned?: boolean; // currently unused but kept for API compatibility
  chats: LessonChat[];
  createdAt?: string;
  updatedAt?: string;
}

interface LessonState {
  selectedClassId: string | null;
  selectedChatId: string | null;
  classesOpen: Record<string, boolean>; // Track which classes are expanded
  classes: LessonClass[];
  isLoadingClasses: boolean;
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  currentMessages: LessonChatMessage[];
  isSendingMessage: boolean;
  streamingMessage: string | null;
}

export const lessonStore = new Store<LessonState>({
  selectedClassId: null,
  selectedChatId: null,
  classesOpen: {},
  classes: [],
  isLoadingClasses: false,
  isLoadingChats: false,
  isLoadingMessages: false,
  currentMessages: [],
  isSendingMessage: false,
  streamingMessage: null,
});

const dateOrNow = (value?: string) => (value ? new Date(value).getTime() : Date.now());

const sortChats = (chats: LessonChat[]) =>
  [...chats].sort((a, b) => {
    const aPinned = !!a.pinned;
    const bPinned = !!b.pinned;
    if (aPinned !== bPinned) return aPinned ? -1 : 1;
    return dateOrNow(b.updatedAt || b.createdAt) - dateOrNow(a.updatedAt || a.createdAt);
  });

export const setSelectedClassId = (id: string | null) => {
  lessonStore.setState((state) => ({
    ...state,
    selectedClassId: id,
    selectedChatId: null, // Reset chat when class changes
    currentMessages: [],
  }));
};

export const setSelectedChatId = (id: string | null) => {
  lessonStore.setState((state) => ({
    ...state,
    selectedChatId: id,
    currentMessages: [],
  }));
};

export const toggleClassOpen = (classId: string) => {
  lessonStore.setState((state) => ({
    ...state,
    classesOpen: {
      ...state.classesOpen,
      [classId]: !state.classesOpen[classId],
    },
  }));
};

export const setClassOpen = (classId: string, open: boolean) => {
  lessonStore.setState((state) => ({
    ...state,
    classesOpen: {
      ...state.classesOpen,
      [classId]: open,
    },
  }));
};

export const setClasses = (classes: LessonClass[]) => {
  lessonStore.setState((state) => ({
    ...state,
    // Newest classes first; chats sorted with pinned first
    classes: [...classes]
      .map((c) => ({ ...c, chats: sortChats(c.chats) }))
      .sort((a, b) => dateOrNow(b.createdAt) - dateOrNow(a.createdAt)),
  }));
};

export const setIsLoadingClasses = (loading: boolean) => {
  lessonStore.setState((state) => ({
    ...state,
    isLoadingClasses: loading,
  }));
};

export const setIsLoadingChats = (loading: boolean) => {
  lessonStore.setState((state) => ({
    ...state,
    isLoadingChats: loading,
  }));
};

export const setIsLoadingMessages = (loading: boolean) => {
  lessonStore.setState((state) => ({
    ...state,
    isLoadingMessages: loading,
  }));
};

export const setCurrentMessages = (messages: LessonChatMessage[]) => {
  lessonStore.setState((state) => ({
    ...state,
    currentMessages: messages,
  }));
};

export const addMessage = (message: LessonChatMessage) => {
  lessonStore.setState((state) => ({
    ...state,
    currentMessages: [...state.currentMessages, message],
  }));
};

export const setIsSendingMessage = (sending: boolean) => {
  lessonStore.setState((state) => ({
    ...state,
    isSendingMessage: sending,
  }));
};

export const setStreamingMessage = (message: string | null) => {
  lessonStore.setState((state) => ({
    ...state,
    streamingMessage: message,
  }));
};

export const appendToStreamingMessage = (chunk: string) => {
  lessonStore.setState((state) => ({
    ...state,
    streamingMessage: (state.streamingMessage || '') + chunk,
  }));
};

export const updateClassChats = (classId: string, chats: LessonChat[]) => {
  lessonStore.setState((state) => ({
    ...state,
    classes: state.classes.map((c) =>
      c.id === classId ? { ...c, chats: sortChats(chats) } : c
    ),
  }));
};

export const addChatToClass = (classId: string, chat: LessonChat) => {
  lessonStore.setState((state) => ({
    ...state,
    classes: state.classes.map((c) =>
      c.id === classId ? { ...c, chats: sortChats([...c.chats, chat]) } : c
    ),
  }));
};

export const updateChatInClass = (classId: string, chatId: string, updates: Partial<LessonChat>) => {
  lessonStore.setState((state) => ({
    ...state,
    classes: state.classes.map((c) =>
      c.id === classId
        ? {
            ...c,
            chats: sortChats(
              c.chats.map((chat) =>
                chat.id === chatId ? { ...chat, ...updates } : chat
              )
            ),
          }
        : c
    ),
  }));
};

export const updateClassInStore = (classId: string, updates: Partial<LessonClass>) => {
  lessonStore.setState((state) => ({
    ...state,
    classes: state.classes.map((c) => (c.id === classId ? { ...c, ...updates } : c)),
  }));
};

export const reorderClasses = (classOrder: LessonClass[]) => {
  lessonStore.setState((state) => ({
    ...state,
    classes: classOrder.map((c) => ({ ...c, chats: sortChats(c.chats) })),
  }));
};
