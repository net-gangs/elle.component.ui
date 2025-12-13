import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enTranslation from "@/locales/en/translation.json";
import jaTranslation from "@/locales/ja/translation.json";
import thTranslation from "@/locales/th/translation.json";
import viTranslation from "@/locales/vi/translation.json";

export const LANGUAGE_OPTIONS: { code: string; labelKey: string }[] = [
  { code: "en", labelKey: "languageSwitcher.languages.en" },
  { code: "vi", labelKey: "languageSwitcher.languages.vi" },
  { code: "ja", labelKey: "languageSwitcher.languages.ja" },
  { code: "th", labelKey: "languageSwitcher.languages.th" },
];

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      vi: { translation: viTranslation },
      ja: { translation: jaTranslation },
      th: { translation: thTranslation },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "vi", "ja", "th"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
