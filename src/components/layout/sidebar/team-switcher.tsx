import * as React from "react";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    planKey: string;
  }[];
}) {
  const [activeTeam, _] = React.useState(teams[0]);
  const { t } = useTranslation();

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <activeTeam.logo className="size-4" />
        </div>

        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{activeTeam.name}</span>
          <span className="truncate text-xs">{t(activeTeam.planKey)}</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
