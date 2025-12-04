import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authStore, authActions, selectUser } from "@/stores/auth-store";

type NavUserProps = {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
};

export function NavUser({ user: fallbackUser }: NavUserProps) {
  const { isMobile } = useSidebar();
  const storeUser = useStore(authStore, selectUser);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authActions.logout();
    navigate({ to: "/login" });
  };

  if (!storeUser && !fallbackUser) {
    return null;
  }

  const fallbackDisplayName = fallbackUser?.name ?? fallbackUser?.email ?? "User";
  const fallbackInitials = fallbackUser?.name
    ? fallbackUser.name.match(/\b\w/g)?.join("")?.slice(0, 2)?.toUpperCase() || "U"
    : fallbackDisplayName.slice(0, 2).toUpperCase() || "U";
  const fallbackAvatarUrl = fallbackUser?.avatar ?? "";
  const fallbackEmail = fallbackUser?.email ?? "";

  const displayName = storeUser
    ? `${storeUser.firstName} ${storeUser.lastName}`.trim() || storeUser.email
    : fallbackDisplayName;
  const initials = storeUser
    ? `${storeUser.firstName?.[0] || ""}${storeUser.lastName?.[0] || ""}`.toUpperCase() || "U"
    : fallbackInitials;
  const avatarUrl = storeUser ? storeUser.photo?.path || "" : fallbackAvatarUrl;
  const email = storeUser ? storeUser.email : fallbackEmail;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                {t("userMenu.upgrade")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                {t("userMenu.account")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                {t("userMenu.billing")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                {t("userMenu.notifications")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              {t("userMenu.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
