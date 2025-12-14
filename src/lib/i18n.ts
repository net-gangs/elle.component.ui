import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enTranslation from "@/locales/en/translation.json";

export const LANGUAGE_OPTIONS: { code: string; labelKey: string }[] = [
  { code: "en", labelKey: "languageSwitcher.languages.en" },
  { code: "vi", labelKey: "languageSwitcher.languages.vi" },
  { code: "ja", labelKey: "languageSwitcher.languages.ja" },
  { code: "th", labelKey: "languageSwitcher.languages.th" },
];

const loadTranslation = async (lang: string) => {
  switch (lang) {
    case "vi":
      return import("@/locales/vi/translation.json");
    case "ja":
      return import("@/locales/ja/translation.json");
    case "th":
      return import("@/locales/th/translation.json");
    default:
      return null;
  }
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
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

i18n.on("languageChanged", async (lng) => {
  if (lng !== "en" && !i18n.hasResourceBundle(lng, "translation")) {
    const translation = await loadTranslation(lng);
    if (translation) {
      i18n.addResourceBundle(lng, "translation", translation.default);
    }
  }
});

export default i18n;
