import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface AddClassCardProps {
  onClick: () => void;
}

export function AddClassCard({ onClick }: AddClassCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="min-w-[120px] h-[120px] rounded-md border-2 border-dashed border-input hover:border-primary hover:bg-primary/5 hover:text-primary text-muted-foreground flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
    >
      <Plus className="size-6" />
      <span className="text-xs font-bold">New Class</span>
    </motion.button>
  );
}
