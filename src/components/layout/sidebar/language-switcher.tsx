import { useCallback, useState } from "react";
import { Check, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  DropdownMenu,
  DropdownMenuContent,
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
import { cn } from "@/lib/utils";
import { LANGUAGE_OPTIONS, changeAppLanguage } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { isMobile } = useSidebar();
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
  const resolvedLanguage = i18n.resolvedLanguage ?? i18n.language ?? "en";
  const activeLanguage =
    String(resolvedLanguage ?? "en")
      .split("-")[0]
      ?.toLowerCase() ?? "en";
  const currentLabel = t(`languageSwitcher.languages.${activeLanguage}`);

  const handleLanguageSelect = useCallback(
    async (code: string) => {
      if (code === activeLanguage) return;
      setPendingLanguage(code);
      try {
        await changeAppLanguage(code);
      } catch (error) {
        console.error("Failed to change language", error);
      } finally {
        setPendingLanguage((current) => (current === code ? null : current));
      }
    },
    [activeLanguage],
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={t("languageSwitcher.tooltip")}
              className="gap-2"
            >
              <Languages className="size-4" />
              <span className="truncate text-sm font-medium">
                {currentLabel}
              </span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isMobile ? "center" : "start"}
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
            className="w-44"
          >
            <DropdownMenuLabel>
              {t("languageSwitcher.menuLabel")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {LANGUAGE_OPTIONS.map((option) => {
              const isActive = option.code === activeLanguage;
              const isPending = pendingLanguage === option.code;

              return (
                <DropdownMenuItem
                  key={option.code}
                  onSelect={(event) => {
                    event.preventDefault();
                    if (!isActive && !isPending) {
                      void handleLanguageSelect(option.code);
                    }
                  }}
                  disabled={Boolean(pendingLanguage && !isPending)}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className={cn(isPending && "opacity-70")}>
                    {t(option.labelKey)}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
