import type { NavItemType } from "@/types/menu";
import { GraduationCap, NotebookPen, ScanLine } from "lucide-react";

export const preparationNavItems: NavItemType = {
  id: "preparation",
  title: "preparation",
  type: "group",
  children: [
    {
      title: "sidebar.items.myClass",
      url: "/",
      type: "item",
      icon: GraduationCap,
      breadcrumbs: false,
    },
    {
      title: "sidebar.items.lessonPlanning",
      url: "/lesson-planning",
      icon: NotebookPen,
      type: "item",
      breadcrumbs: false,
    },
    {
      title: "sidebar.items.scanYourFile",
      url: "#",
      icon: ScanLine,
    },
  ],
};
