export interface Chat {
  id: string;
  classroomId: string;
  title: string;
  focus?: string;
  tone?: string;
  pinned: boolean;
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

export interface Message {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  lessonId?: string | null;
  lessonTitle?: string | null;
  lessonCreatedAt?: string | null;
}

export interface ChatWithMessages extends Chat {
  messages: Message[];
}
