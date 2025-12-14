// Example: Navigation with nested/collapsible items
// File: src/app/nav-items/example-nested.ts

import type { NavItemType } from "@/types/menu";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  FileText,
  Folder,
  Image,
  Video,
} from "lucide-react";

export const exampleNestedNavItems: NavItemType = {
  id: "example-nested",
  title: "example-nested",
  type: "group",
  children: [
    // Regular item (no children)
    {
      id: "profile",
      title: "sidebar.items.profile",
      url: "/profile",
      icon: User,
      type: "item",
    },

    // Collapsible item with children
    {
      id: "settings",
      title: "sidebar.items.settings",
      icon: Settings,
      type: "collapse", // Important: type must be "collapse" for nested items
      children: [
        {
          id: "settings-general",
          title: "sidebar.items.general",
          url: "/settings/general",
          icon: Settings,
          type: "item",
        },
        {
          id: "settings-appearance",
          title: "sidebar.items.appearance",
          url: "/settings/appearance",
          icon: Palette,
          type: "item",
        },
        {
          id: "settings-notifications",
          title: "sidebar.items.notifications",
          url: "/settings/notifications",
          icon: Bell,
          type: "item",
        },
        {
          id: "settings-security",
          title: "sidebar.items.security",
          url: "/settings/security",
          icon: Shield,
          type: "item",
        },
        {
          id: "settings-privacy",
          title: "sidebar.items.privacy",
          url: "/settings/privacy",
          icon: Shield,
          type: "item",
        },
      ],
    },

    // Another collapsible item
    {
      id: "resources",
      title: "sidebar.items.resources",
      icon: Database,
      type: "collapse",
      children: [
        {
          id: "resources-documents",
          title: "sidebar.items.documents",
          url: "/resources/documents",
          icon: FileText,
          type: "item",
        },
        {
          id: "resources-media",
          title: "sidebar.items.media",
          url: "/resources/media",
          icon: Folder,
          type: "item",
        },
        {
          id: "resources-images",
          title: "sidebar.items.images",
          url: "/resources/images",
          icon: Image,
          type: "item",
        },
        {
          id: "resources-videos",
          title: "sidebar.items.videos",
          url: "/resources/videos",
          icon: Video,
          type: "item",
        },
      ],
    },

    // Regular item at the end
    {
      id: "preferences",
      title: "sidebar.items.preferences",
      url: "/preferences",
      icon: Globe,
      type: "item",
    },
  ],
};

// Translation keys needed:
// {
//   "sidebar": {
//     "groups": {
//       "example-nested": "Examples"
//     },
//     "items": {
//       "profile": "Profile",
//       "settings": "Settings",
//       "general": "General",
//       "appearance": "Appearance",
//       "notifications": "Notifications",
//       "security": "Security",
//       "privacy": "Privacy",
//       "resources": "Resources",
//       "documents": "Documents",
//       "media": "Media",
//       "images": "Images",
//       "videos": "Videos",
//       "preferences": "Preferences"
//     }
//   }
// }

// Key points:
// 1. Use type: "collapse" for items with children
// 2. Use type: "item" for regular clickable items
// 3. Children can have their own icons
// 4. Collapsible items auto-expand when a child is active
// 5. Icons are optional but recommended for clarity
