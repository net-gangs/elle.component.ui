import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { NavItemType } from "@/types/menu";

interface NavMainProps {
  groupLabel?: string;
  items: NavItemType[];
}

export function NavMain({ groupLabel, items }: NavMainProps) {
  const { t } = useTranslation();
  const routerState = useRouterState();
  const currentPathname = routerState.location.pathname;

  const isItemOrChildActive = (item: NavItemType): boolean => {

    if (item.url && item.url !== "#") {
      if (item.url === "/") {
        if (currentPathname === "/") return true;
      } else if (currentPathname.startsWith(item.url)) {
        return true;
      }
    }

    if (item.children) {
      return item.children.some((child) => isItemOrChildActive(child));
    }

    return false;
  };

  const renderMenuItem = (item: NavItemType) => {
    const Icon = item.icon;
    const isActive = isItemOrChildActive(item);
    const isNavigable = Boolean(item.url && item.url !== "#");
    const hasChildren = item.children && item.children.length > 0;

    if (item.type === "collapse" && hasChildren) {
      return (
        <Collapsible
          key={item.id || item.title?.toString()}
          asChild
          defaultOpen={isActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={t(item.title as string)}>
                {Icon && <Icon />}
                <span>{t(item.title as string)}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.children?.map((subItem) => {
                  const SubIcon = subItem.icon;
                  const subIsNavigable = Boolean(
                    subItem.url && subItem.url !== "#"
                  );
                  const subIsActive =
                    subIsNavigable && subItem.url
                      ? subItem.url === "/"
                        ? currentPathname === "/"
                        : currentPathname.startsWith(subItem.url)
                      : false;

                  return (
                    <SidebarMenuSubItem key={subItem.id || subItem.title?.toString()}>
                      {subIsNavigable ? (
                        <SidebarMenuSubButton asChild isActive={subIsActive}>
                          <Link to={subItem.url!}>
                            {SubIcon && <SubIcon />}
                            <span>{t(subItem.title as string)}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      ) : (
                        <SidebarMenuSubButton isActive={subIsActive}>
                          {SubIcon && <SubIcon />}
                          <span>{t(subItem.title as string)}</span>
                        </SidebarMenuSubButton>
                      )}
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    const buttonContent = (
      <>
        {Icon && <Icon />}
        <span>{t(item.title as string)}</span>
      </>
    );

    return (
      <SidebarMenuItem key={item.id || item.title?.toString()}>
        {isNavigable ? (
          <SidebarMenuButton
            asChild
            tooltip={t(item.title as string)}
            isActive={isActive}
            disabled={item.disabled}
          >
            <Link to={item.url!}>{buttonContent}</Link>
          </SidebarMenuButton>
        ) : (
          <SidebarMenuButton
            tooltip={t(item.title as string)}
            isActive={isActive}
            disabled={item.disabled || !isNavigable}
          >
            {buttonContent}
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    );
  };

  return (
    <SidebarGroup>
      {groupLabel && <SidebarGroupLabel>{t(groupLabel)}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          // Skip group items (they should be at the top level)
          if (item.type === "group") {
            return null;
          }

          return renderMenuItem(item);
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
