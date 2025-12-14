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

const resourceLoaders = new Map<string, Promise<void>>();

export const ensureLanguageResources = async (lang: string) => {
  if (lang === "en" || i18n.hasResourceBundle(lang, "translation")) {
    return;
  }

  if (resourceLoaders.has(lang)) {
    return resourceLoaders.get(lang);
  }

  const loadPromise = (async () => {
    const translation = await loadTranslation(lang);
    if (translation?.default) {
      i18n.addResourceBundle(
        lang,
        "translation",
        translation.default,
        true,
        true,
      );
    }
  })().finally(() => {
    resourceLoaders.delete(lang);
  });

  resourceLoaders.set(lang, loadPromise);
  return loadPromise;
};

export const changeAppLanguage = async (lang: string) => {
  await ensureLanguageResources(lang);
  await i18n.changeLanguage(lang);
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

i18n.on("languageChanged", (lng) => {
  void ensureLanguageResources(lng);
});

export default i18n;
