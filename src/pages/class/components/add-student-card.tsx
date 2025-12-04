import { Plus } from "lucide-react";

interface AddStudentCardProps {
  onClick?: () => void;
}

function AddStudentCard({ onClick }: AddStudentCardProps) {
  const handleClick = () => {
    console.log("Add student clicked");
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className="group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-primary/30 bg-card/50 p-4 text-center backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary hover:bg-card hover:shadow-md"
    >

      <div className="relative mb-3">
        <div className="flex size-16 items-center justify-center rounded-full border border-border bg-primary/10 text-primary transition-all duration-300 group-hover:rotate-90 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
          <Plus className="size-6" />
        </div>
      </div>


      <h3 className="w-full truncate text-sm font-semibold text-primary/80 transition-colors group-hover:text-primary">
        Add Student
      </h3>

      <p className="mt-1 font-mono text-xs text-muted-foreground/50">
        Click to add
      </p>
    </button>
  );
}

export { AddStudentCard };
export type { AddStudentCardProps };
