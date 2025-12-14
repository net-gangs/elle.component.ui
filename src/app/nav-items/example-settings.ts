// Example: How to add a new "Settings" navigation group
// File: src/app/nav-items/settings.ts

import type { NavItemType } from "@/types/menu";
import { Settings, User, Bell, Shield } from "lucide-react";

export const settingsNavItems: NavItemType = {
  id: "settings",
  title: "settings", // Will use translation key: sidebar.groups.settings
  type: "group",
  children: [
    {
      title: "sidebar.items.profile",
      url: "/settings/profile",
      type: "item",
      icon: User,
      breadcrumbs: true,
    },
    {
      title: "sidebar.items.notifications",
      url: "/settings/notifications",
      type: "item",
      icon: Bell,
      breadcrumbs: true,
    },
    {
      title: "sidebar.items.security",
      url: "/settings/security",
      type: "item",
      icon: Shield,
      breadcrumbs: true,
    },
    {
      title: "sidebar.items.preferences",
      url: "/settings/preferences",
      type: "item",
      icon: Settings,
      breadcrumbs: true,
    },
  ],
};

// Then in src/app/nav-items/index.ts, add:
// import { settingsNavItems } from "./settings";
// 
// const rootNavItems: NavItemType[] = [
//   preparationNavItems,
//   toolNavItems,
//   settingsNavItems, // <-- Add here
// ];

// Don't forget to add translations in all locale files:
// {
//   "sidebar": {
//     "groups": {
//       "settings": "Settings"
//     },
//     "items": {
//       "profile": "Profile",
//       "notifications": "Notifications",
//       "security": "Security",
//       "preferences": "Preferences"
//     }
//   }
// }
