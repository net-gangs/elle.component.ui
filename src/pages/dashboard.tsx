import { ClassForm } from "@/components/forms/class-form";
import { classService } from "@/services/class-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Dashboard() {
  const queryClient = useQueryClient();

  const createClassMutation = useMutation({
    mutationFn: classService.create,

    onSuccess: () => {
      toast.success("Class created successfully");
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });

  return (
    <div className="space-y-6 m-5">
      <ClassForm
        onSubmit={(data) => createClassMutation.mutate(data)}
        isSubmitting={createClassMutation.isPending}
      />
      {/* <ClassForm
        initialData={{ name: "test", grade: "test" }}
        onSubmit={() => console.log("It works")}
      /> */}
    </div>
  );
}
