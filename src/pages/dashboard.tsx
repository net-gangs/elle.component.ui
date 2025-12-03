import { classroomService } from "@/services/class-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Dashboard() {
  const queryClient = useQueryClient();

  // const createClassMutation = useMutation({
  //   mutationFn: classroomService.create,

  //   onSuccess: () => {
  //     toast.success("Class created successfully");
  //     queryClient.invalidateQueries({ queryKey: ["classrooms"] });
  //   },
  // });

  // const updateClassMutation = useMutation({
  //   mutationFn: ({
  //     id,
  //     data,
  //   }: {
  //     id: string;
  //     data: { name: string; grade: string };
  //   }) => {
  //     return classroomService.update(id, data);
  //   },
  //   onSuccess: () => {
  //     toast.success("Class updated successfully");
  //     queryClient.invalidateQueries({ queryKey: ["classrooms"] });
  //   },
  // });

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
    </div>
  );
}
