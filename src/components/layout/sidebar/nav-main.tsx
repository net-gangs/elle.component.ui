import { type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

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

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(groupLabel)}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.titleKey}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={t(item.titleKey)}>
                {item.icon && <item.icon />}
                <span>{t(item.titleKey)}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
