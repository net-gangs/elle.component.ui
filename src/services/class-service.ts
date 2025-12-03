import { apiClient } from "@/lib/api-client";

export type CreateClassDto = {
  name: string;
  grade: string;
};

export const classService = {
  create: (data: CreateClassDto) => {
    return apiClient.post("/classrooms", data);
  },
};