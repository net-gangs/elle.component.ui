import { useCallback, useState } from "react";
import { Check, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LANGUAGE_OPTIONS, changeAppLanguage } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-2">
          <Languages />
          {currentLabel}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>{t("languageSwitcher.menuLabel")}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {LANGUAGE_OPTIONS.map((option) => {
          const isActive = option.code === activeLanguage;
          const isPending = pendingLanguage === option.code;

          return (
            <DropdownMenuItem
              key={option.code}
              className="justify-between cursor-pointer"
              onSelect={(event) => {
                event.preventDefault();
                if (!isActive && !isPending) {
                  void handleLanguageSelect(option.code);
                }
              }}
              disabled={Boolean(pendingLanguage && !isPending)}
            >
              <span className={isPending ? "opacity-70" : undefined}>
                {t(option.labelKey)}
              </span>
              {(isActive || isPending) && <Check className="ml-2 size-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
