import { CEFR_LEVEL_VALUES, SPECIAL_NEED_VALUES } from "@/types/classroom";
import z from "zod";

export const studentSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  grade: z.string(),
  hobby: z.string(),
  notes: z.string(),
  avatarUrl: z.string().optional(),
  specialNeeds: z.array(z.enum(SPECIAL_NEED_VALUES)),
  cefrLevels: z.object({
    reading: z.enum(CEFR_LEVEL_VALUES).optional(),
    writing: z.enum(CEFR_LEVEL_VALUES).optional(),
    speaking: z.enum(CEFR_LEVEL_VALUES).optional(),
    listening: z.enum(CEFR_LEVEL_VALUES).optional(),
  }),
});

export type StudentFormData = z.infer<typeof studentSchema>;
