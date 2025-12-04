import * as React from "react";
import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
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
  const { state, toggleSidebar } = useSidebar();

  if (!activeTeam) {
    return null;
  }

  const handleLogoClick = () => {
    if (state === "collapsed") {
      toggleSidebar();
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleLogoClick}
          className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
        >
          <activeTeam.logo className="size-4" />
        </button>

        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{activeTeam.name}</span>
          <span className="truncate text-xs">{t(activeTeam.planKey)}</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
