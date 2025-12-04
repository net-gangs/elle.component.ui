import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface AddClassCardProps {
  onClick: () => void;
}

export function AddClassCard({ onClick }: AddClassCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border-2 border-dashed border-input text-muted-foreground transition-all cursor-pointer hover:border-primary hover:bg-primary/5 hover:text-primary"
      title="Add Class"
    >
      <Plus className="size-4" />
      
    </motion.button>
  );
}
