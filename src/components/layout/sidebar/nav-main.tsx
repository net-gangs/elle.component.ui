import { type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useRouterState } from "@tanstack/react-router";

import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  groupLabel,
  items,
}: {
  groupLabel: string;
  items: {
    titleKey: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      titleKey: string;
      url: string;
    }[];
  }[];
}) {
  const { t } = useTranslation();
  const routerState = useRouterState();
  const currentPathname = routerState.location.pathname;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(groupLabel)}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isNavigable = Boolean(item.url && item.url !== "#");
          const derivedActive =
            isNavigable && item.url
              ? item.url === "/"
                ? currentPathname === "/"
                : currentPathname.startsWith(item.url)
              : false;
          const isActive = item.isActive ?? derivedActive;

          const buttonContent = (
            <>
              {item.icon && <item.icon />}
              <span>{t(item.titleKey)}</span>
            </>
          );

          return (
            <Collapsible
              key={item.titleKey}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {isNavigable ? (
                  <SidebarMenuButton
                    asChild
                    tooltip={t(item.titleKey)}
                    isActive={isActive}
                  >
                    <Link to={item.url!}>{buttonContent}</Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    tooltip={t(item.titleKey)}
                    isActive={isActive}
                    disabled
                  >
                    {buttonContent}
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
