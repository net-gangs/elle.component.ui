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

const LANGUAGE_OPTIONS: { code: string; labelKey: string }[] = [
  { code: "en", labelKey: "languageSwitcher.languages.en" },
  { code: "vi", labelKey: "languageSwitcher.languages.vi" },
  { code: "ja", labelKey: "languageSwitcher.languages.ja" },
  { code: "th", labelKey: "languageSwitcher.languages.th" },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { isMobile } = useSidebar();
  const resolvedLanguage = i18n.resolvedLanguage ?? i18n.language ?? "en";
  const activeLanguage = resolvedLanguage.split("-")[0]?.toLowerCase() ?? "en";
  const currentLabel = t(`languageSwitcher.languages.${activeLanguage}`);

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
            <DropdownMenuLabel>{t("languageSwitcher.menuLabel")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {LANGUAGE_OPTIONS.map((option) => {
              const isActive = option.code === activeLanguage;

              return (
                <DropdownMenuItem
                  key={option.code}
                  onSelect={(event) => {
                    event.preventDefault();
                    if (!isActive) {
                      void i18n.changeLanguage(option.code);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{t(option.labelKey)}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
