import type { ComponentProps } from "react";

import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { LanguageSwitcher } from "./language-switcher";

import navItems from "@/app/nav-items";
import heading from "@/app/heading";

export const AppSidebar = (props: ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex-row items-center justify-between">
        <TeamSwitcher teams={heading.teams} />
        <SidebarTrigger className="size-7" />
      </SidebarHeader>
      <SidebarContent>
        {navItems.map((group) => (
          <NavMain
            key={group.id}
            groupLabel={group.title ? `sidebar.groups.${group.id}` : undefined}
            items={group.children || []}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <LanguageSwitcher />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
