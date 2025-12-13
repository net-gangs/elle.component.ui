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

const LANGUAGE_OPTIONS = [
  { code: "en", labelKey: "languageSwitcher.languages.en" },
  { code: "vi", labelKey: "languageSwitcher.languages.vi" },
  { code: "ja", labelKey: "languageSwitcher.languages.ja" },
  { code: "th", labelKey: "languageSwitcher.languages.th" },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const resolvedLanguage = i18n.resolvedLanguage ?? i18n.language ?? "en";
  const activeLanguage = resolvedLanguage.split("-")[0]?.toLowerCase() ?? "en";
  const currentLabel = t(`languageSwitcher.languages.${activeLanguage}`);

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

          return (
            <DropdownMenuItem
              key={option.code}
              onClick={() => i18n.changeLanguage(option.code)}
              className="justify-between cursor-pointer"
            >
              <span>{t(option.labelKey)}</span>
              {isActive && <Check className="ml-2 size-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
