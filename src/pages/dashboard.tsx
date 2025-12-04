import { StudentForm } from "@/components/forms/student-form";
import { classroomService } from "@/services/class-service";
import {
  studentService
} from "@/services/student-service";
import type { CreateStudentDto, UpdateStudentDto } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Dashboard() {
  const queryClient = useQueryClient();

  const createClassMutation = useMutation({
    mutationFn: classroomService.create,

    onSuccess: () => {
      toast.success("Class created successfully");
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });

  const updateClassMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; grade: string };
    }) => {
      return classroomService.update(id, data);
    },
    onSuccess: () => {
      toast.success("Class updated successfully");
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: (data: CreateStudentDto) => {
      return studentService.create(
        "1dc4fbfd-b406-45ec-a85d-572d53dea3f8",
        data
      );
    },
    onSuccess: () => {
      toast.success("Student created successfully");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: ({
      classId,
      studentId,
      data,
    }: {
      classId: string;
      studentId: string;
      data: UpdateStudentDto;
    }) => {
      return studentService.update(classId, studentId, data);
    },
    onSuccess: (_, variables) => {
      toast.success("Student updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["students", variables.classId],
      });

      queryClient.invalidateQueries({
        queryKey: ["student", variables.studentId],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update student");
    },
  });

  const student = {
    fullName: "MiChos",
    grade: "9000",
    hobby: "Gacha",
    notes: "LOL NADJAWD",
    avatarUrl: "https://",
    specialNeeds: ["ACEs", "Dysgraphia"],
    cefrLevels: {
      reading: "B2",
      writing: "B2",
      speaking: "B2",
      listening: "B2",
    },
  };

  return (
    <div className="space-y-6 m-5">
      {/* <ClassForm Create Class Form
        onSubmit={(data) => createClassMutation.mutate(data)}
        isSubmitting={createClassMutation.isPending}
      /> */}
      {/* <ClassForm Update class Form
        initialData={{ name: "test 1", grade: "test" }}
        onSubmit={(data) => {
          updateClassMutation.mutate({
            id: "1dc4fbfd-b406-45ec-a85d-572d53dea3f8",
            data: data,
          });
        }}
        isSubmitting={updateClassMutation.isPending}
      /> */}
      {/* <StudentForm
        onSubmit={(data) => createStudentMutation.mutate(data)}
        isSubmitting={createStudentMutation.isPending}
      /> */}
      <StudentForm
        initialData={student}
        onSubmit={(formData) => {
          updateStudentMutation.mutate({
            classId: "1dc4fbfd-b406-45ec-a85d-572d53dea3f8",
            studentId: "eaca34c2-bdf9-4802-8f0c-5a43d4c60403",
            data: formData,
          });
        }}
        isSubmitting={createStudentMutation.isPending}
      />
    </div>
  );
}
