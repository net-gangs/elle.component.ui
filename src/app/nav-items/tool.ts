import type { NavItemType } from "@/types/menu";
import { Folder, Lightbulb, Newspaper, Trophy } from "lucide-react";

export const toolNavItems: NavItemType = {
  id: "tool",
  title: "tool",
  type: "group",
  children: [
    {
        title: "sidebar.items.tipsAndTricks",
        url: "#",
        icon: Lightbulb,
        disabled: true,
      },
      {
        title: "sidebar.items.rewards",
        url: "#",
        icon: Trophy,
        disabled: true,
      },
      {
        title: "sidebar.items.interestingArticles",
        url: "#",
        icon: Newspaper,
        disabled: true,
      },
      {
        title: "sidebar.items.filesLibrary",
        url: "#",
        icon: Folder,
        disabled: true,
      },
  ],
};