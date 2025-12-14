# Sidebar Configuration Guide

This guide explains how the sidebar navigation system works and how to configure menu items, including support for nested/collapsible navigation.

## Architecture Overview

The sidebar navigation is built with a **config-driven approach** using shadcn/ui components. All menu items are centrally configured, making it easy to add, remove, or modify navigation items without touching component code.

### Key Features

✅ **Config-driven** - Define menus in simple TypeScript files  
✅ **Nested navigation** - Support for collapsible sub-menus  
✅ **Auto-active states** - Highlights current page automatically  
✅ **i18n support** - Multi-language translations built-in  
✅ **Icon support** - Full Lucide icon library integration  
✅ **Type-safe** - TypeScript ensures correctness  
✅ **Responsive** - Works on mobile and desktop  

### Key Components

1. **Config Files** (`src/app/`)
   - `heading/index.ts` - Team/brand header configuration
   - `nav-items/index.ts` - Main navigation items aggregator
   - `nav-items/*.ts` - Individual navigation group definitions

2. **UI Components** (`src/components/layout/sidebar/`)
   - `app-sidebar.tsx` - Main sidebar container
   - `nav-main.tsx` - Navigation group renderer
   - `team-switcher.tsx` - Brand/team header
   - `nav-user.tsx` - User menu in footer
   - `language-switcher.tsx` - Language selector

3. **Type Definitions** (`src/types/menu.ts`)
   - `NavItemType` - Navigation item structure

## Configuration Files

### Heading Configuration

**File:** `src/app/heading/index.ts`

```typescript
import { GalleryVerticalEnd } from "lucide-react";

const heading = {
  teams: [
    {
      name: "ELLA AI",
      logo: GalleryVerticalEnd,
      planKey: "team.plan.enterprise",
    },
  ],
}

export default heading;
```

### Navigation Items Configuration

**File:** `src/app/nav-items/index.ts`

```typescript
import type { NavItemType } from "@/types/menu";
import { preparationNavItems } from "./preparation";
import { toolNavItems } from "./tool";

const rootNavItems: NavItemType[] = [
  preparationNavItems,
  toolNavItems,
];

export default rootNavItems;
```

### Individual Navigation Groups

**Example:** `src/app/nav-items/preparation.ts`

```typescript
import type { NavItemType } from "@/types/menu";
import { GraduationCap, NotebookPen, ScanLine } from "lucide-react";

export const preparationNavItems: NavItemType = {
  id: "preparation",
  title: "preparation", // Translation key
  type: "group",
  children: [
    {
      title: "sidebar.items.myClass",
      url: "/my-class",
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
      disabled: true, // Optional: disable navigation
    },
  ],
};
```

## NavItemType Structure

```typescript
export type NavItemType = {
  // Basic properties
  id?: string;              // Unique identifier for the item
  title?: string;           // Translation key (e.g., "sidebar.items.myClass")
  type?: string;            // "group" | "item" | "collapse"
  url?: string;             // Navigation URL or "#" for disabled/collapse items
  
  // Visual properties
  icon?: LucideIcon;        // Icon component from lucide-react
  color?: "primary" | "secondary" | "default";
  
  // Behavior
  disabled?: boolean;       // Disable the menu item
  external?: boolean;       // Open in new tab
  target?: boolean;         // _blank target
  breadcrumbs?: boolean;    // Show in breadcrumbs
  
  // Structure (for nested navigation)
  children?: NavItemType[]; // Nested items (used with type: "collapse")
  caption?: string;         // Optional description
  search?: string;          // For search functionality
};
```

### Item Types Explained

- **`type: "group"`** - Top-level group container (used at root level only)
- **`type: "item"`** - Regular clickable menu item
- **`type: "collapse"`** - Collapsible item with sub-menu (requires `children` array)

## Basic Navigation Items

### Simple Item (No Children)

```typescript
{
  id: "my-class",
  title: "sidebar.items.myClass",
  url: "/my-class",
  type: "item",
  icon: GraduationCap,
  breadcrumbs: false,
}
```

## Nested/Collapsible Navigation

### Collapsible Item with Children

```typescript
{
  id: "settings",
  title: "sidebar.items.settings",
  icon: Settings,
  type: "collapse",        // Important: Use "collapse" type
  children: [              // Define sub-items
    {
      id: "settings-general",
      title: "sidebar.items.general",
      url: "/settings/general",
      icon: Sliders,
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
}
```

### Complete Example with Nested Items

```typescript
// src/app/nav-items/admin.ts
import type { NavItemType } from "@/types/menu";
import { Settings, Users, Database, Shield } from "lucide-react";

export const adminNavItems: NavItemType = {
  id: "admin",
  title: "admin",
  type: "group",
  children: [
    // Collapsible Settings
    {
      id: "settings",
      title: "sidebar.items.settings",
      icon: Settings,
      type: "collapse",
      children: [
        {
          id: "settings-general",
          title: "sidebar.items.general",
          url: "/admin/settings/general",
          icon: Settings,
          type: "item",
        },
        {
          id: "settings-security",
          title: "sidebar.items.security",
          url: "/admin/settings/security",
          icon: Shield,
          type: "item",
        },
      ],
    },
    // Regular item
    {
      id: "users",
      title: "sidebar.items.users",
      url: "/admin/users",
      icon: Users,
      type: "item",
    },
  ],
};
```

### Features of Nested Navigation

1. **Auto-expand**: Collapsible items automatically expand when a child route is active
2. **Chevron indicator**: Shows expand/collapse state with animated chevron icon
3. **Visual hierarchy**: Sub-items are indented and styled differently
4. **Active state propagation**: Parent highlights when child is active
5. **Icon support**: Both parent and children can have icons

## Translation Keys

All menu item labels use i18n translation keys. The structure is:

```json
{
  "sidebar": {
    "groups": {
      "preparation": "Preparation",
      "tool": "Tools"
    },
    "items": {
      "myClass": "My Class",
      "lessonPlanning": "Lesson Planning",
      "scanYourFile": "Scan Your File",
      // ... more items
    }
  }
}
```

**Supported Languages:**
- English (`src/locales/en/translation.json`)
- Vietnamese (`src/locales/vi/translation.json`)
- Thai (`src/locales/th/translation.json`)
- Japanese (`src/locales/ja/translation.json`)

## How to Add New Menu Items

### 1. Create a New Navigation Group

Create a new file in `src/app/nav-items/`:

```typescript
// src/app/nav-items/analytics.ts
import type { NavItemType } from "@/types/menu";
import { BarChart, LineChart, PieChart } from "lucide-react";

export const analyticsNavItems: NavItemType = {
  id: "analytics",
  title: "analytics",
  type: "group",
  children: [
    {
      title: "sidebar.items.dashboard",
      url: "/analytics/dashboard",
      type: "item",
      icon: BarChart,
    },
    {
      title: "sidebar.items.reports",
      url: "/analytics/reports",
      type: "item",
      icon: LineChart,
    },
    {
      title: "sidebar.items.charts",
      url: "/analytics/charts",
      type: "item",
      icon: PieChart,
    },
  ],
};
```

### 2. Register the Group

Add it to `src/app/nav-items/index.ts`:

```typescript
import { preparationNavItems } from "./preparation";
import { toolNavItems } from "./tool";
import { analyticsNavItems } from "./analytics"; // Add import

const rootNavItems: NavItemType[] = [
  preparationNavItems,
  toolNavItems,
  analyticsNavItems, // Add to array
];

export default rootNavItems;
```

### 3. Add Translation Keys

Update all language files:

**English** (`src/locales/en/translation.json`):
```json
{
  "sidebar": {
    "groups": {
      "preparation": "Preparation",
      "tool": "Tools",
      "analytics": "Analytics"
    },
    "items": {
      "dashboard": "Dashboard",
      "reports": "Reports",
      "charts": "Charts"
    }
  }
}
```

Repeat for other languages.

### 4. Done!

The sidebar will automatically render your new group and items. No changes to component code required.

## Adding Items to Existing Groups

To add a new item to an existing group, simply edit the group file:

```typescript
// src/app/nav-items/preparation.ts
export const preparationNavItems: NavItemType = {
  id: "preparation",
  title: "preparation",
  type: "group",
  children: [
    // ... existing items
    {
      title: "sidebar.items.newFeature", // Add new item
      url: "/new-feature",
      type: "item",
      icon: Sparkles,
    },
  ],
};
```

Don't forget to add the translation key!

## Features

### Active State Detection

The sidebar automatically highlights the active menu item based on the current route:

```typescript
// Exact match for home
if (item.url === "/") {
  isActive = currentPathname === "/";
}
// Prefix match for all other routes
else {
  isActive = currentPathname.startsWith(item.url);
}
```

### Disabled Items

Items with `disabled: true` or `url: "#"` are rendered but not clickable:

```typescript
{
  title: "sidebar.items.comingSoon",
  url: "#",
  icon: Rocket,
  disabled: true,
}
```

### Icon Support

Use any icon from [Lucide Icons](https://lucide.dev/icons):

```typescript
import { Home, Settings, User } from "lucide-react";
```

### Collapsible Sidebar

The sidebar supports icon-only collapsed mode. Icons and tooltips are automatically handled by the shadcn sidebar component.

## Component Flow

```
app-sidebar.tsx
  ├─ Imports navItems from @/app/nav-items
  ├─ Imports heading from @/app/heading
  │
  ├─ SidebarHeader
  │   ├─ TeamSwitcher (uses heading.teams)
  │   └─ SidebarTrigger
  │
  ├─ SidebarContent
  │   └─ Maps navItems → NavMain components
  │       └─ Each NavMain renders group items
  │
  └─ SidebarFooter
      ├─ LanguageSwitcher
      └─ NavUser
```

## Best Practices

1. **Keep groups focused** - Each group should represent a logical section
2. **Use meaningful IDs** - Group IDs should match translation keys
3. **Consistent naming** - Use camelCase for IDs, dot notation for translation keys
4. **Icon consistency** - Choose icons that clearly represent the feature
5. **Translation completeness** - Always add keys to all language files
6. **Disable unavailable features** - Use `disabled: true` for coming-soon features

## Troubleshooting

### Menu items not showing
- Check that the group is imported and added to `rootNavItems` in `nav-items/index.ts`
- Verify the `type` field is set correctly ("group" for groups, "item" for items)

### Translation missing
- Ensure translation keys exist in all language files
- Check the key format: `sidebar.groups.{groupId}` or `sidebar.items.{itemId}`

### Active state not working
- Verify the `url` field matches your route exactly
- For nested routes, use the base path (e.g., `/lesson-planning` for `/lesson-planning/*`)

### Icons not rendering
- Check that you imported the icon from `lucide-react`
- Ensure the icon is assigned to the `icon` property (not as a string)
