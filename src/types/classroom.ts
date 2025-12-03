// Types based on OpenAPI spec

export interface Classroom {
  id: string;
  name: string;
  grade?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateClassroomDto {
  name: string;
  grade?: string;
  code?: string;
}

export interface UpdateClassroomDto {
  name?: string;
  grade?: string;
  code?: string;
}

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type SpecialNeed =
  | "ADHD"
  | "ODD"
  | "ASD"
  | "Depression"
  | "ACEs"
  | "Dysgraphia"
  | "Dyslexia"
  | "Anxiety Disorders";

export interface CefrLevels {
  reading?: CefrLevel;
  writing?: CefrLevel;
  speaking?: CefrLevel;
  listening?: CefrLevel;
}

export interface Student {
  id: string;
  classroomId: string;
  fullName: string;
  grade?: string;
  hobby?: string;
  notes?: string;
  currentLevel?: CefrLevel;
  avatarUrl?: string;
  specialNeeds?: SpecialNeed[];
  cefrLevels?: CefrLevels;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateStudentDto {
  fullName: string;
  grade?: string;
  hobby?: string;
  notes?: string;
  currentLevel?: CefrLevel;
  avatarUrl?: string;
  specialNeeds?: SpecialNeed[];
  cefrLevels?: CefrLevels;
}

export interface UpdateStudentDto {
  fullName?: string;
  grade?: string;
  hobby?: string;
  notes?: string;
  currentLevel?: CefrLevel;
  avatarUrl?: string;
  specialNeeds?: SpecialNeed[];
  cefrLevels?: CefrLevels;
}

export type LessonStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface LessonStructuredContent {
  sections?: Array<{
    title: string;
    duration: number;
    activity: string;
  }>;
}

export interface Lesson {
  id: string;
  classroomId: string;
  title: string;
  topic?: string;
  targetLanguage?: string;
  scheduledOn?: string;
  status: LessonStatus;
  durationMinutes?: number;
  gradeYear?: string;
  cefrReading?: CefrLevel;
  cefrWriting?: CefrLevel;
  cefrSpeaking?: CefrLevel;
  cefrListening?: CefrLevel;
  learningObjectives?: string;
  teachingActivities?: string;
  contentMd?: string;
  structuredContent?: LessonStructuredContent;
  generated?: boolean;
  generatedAt?: string;
  prompt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateLessonDto {
  title: string;
  topic?: string;
  targetLanguage?: string;
  scheduledOn?: string;
  status?: LessonStatus;
  durationMinutes?: number;
  gradeYear?: string;
  cefrReading?: CefrLevel;
  cefrWriting?: CefrLevel;
  cefrSpeaking?: CefrLevel;
  cefrListening?: CefrLevel;
  learningObjectives?: string;
  teachingActivities?: string;
  contentMd?: string;
  structuredContent?: LessonStructuredContent;
  generated?: boolean;
  prompt?: string;
}

export interface UpdateLessonDto {
  title?: string;
  topic?: string;
  targetLanguage?: string;
  scheduledOn?: string;
  status?: LessonStatus;
  durationMinutes?: number;
  gradeYear?: string;
  cefrReading?: CefrLevel;
  cefrWriting?: CefrLevel;
  cefrSpeaking?: CefrLevel;
  cefrListening?: CefrLevel;
  learningObjectives?: string;
  teachingActivities?: string;
  contentMd?: string;
  structuredContent?: LessonStructuredContent;
  generated?: boolean;
  prompt?: string;
}

// Pagination types
export interface InfinityPaginationResponse<T> {
  data: T[];
  hasNextPage: boolean;
}

export type InfinityPaginationClassroomResponseDto =
  InfinityPaginationResponse<Classroom>;
export type InfinityPaginationStudentResponseDto =
  InfinityPaginationResponse<Student>;
export type InfinityPaginationLessonResponseDto =
  InfinityPaginationResponse<Lesson>;
