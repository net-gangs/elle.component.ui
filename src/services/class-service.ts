import { apiClient } from "@/lib/api-client";

export type CreateClassDto = {
  name: string;
  grade: string;
};

export type UpdateClassDto = Partial<CreateClassDto>;

export const classService = {
  create: (data: CreateClassDto) => {
    return apiClient.post("/classrooms", data);
  },

  update: (id: string, data: UpdateClassDto) => {
    return apiClient.patch(`/classrooms/${id}`, data);
  },
};