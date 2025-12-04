# Internationalization Guide

This project uses `i18next` with `react-i18next` and `i18next-browser-languagedetector` to support English, Vietnamese, Japanese, and Thai. The language can be changed from the sidebar using the globe icon.

## Getting Started

1. Install dependencies (runs the i18n packages together with the rest of the stack):
   ```powershell
   pnpm install
   ```
2. Start the dev server and ensure translations load:
   ```powershell
   pnpm dev
   ```

## Key Files

```
src/
  lib/i18n.ts                 # i18next configuration and language detector setup
  locales/
    en/translation.json       # English strings
    vi/translation.json       # Vietnamese strings
    ja/translation.json       # Japanese strings
    th/translation.json       # Thai strings
  components/layout/sidebar/
    language-switcher.tsx     # Sidebar globe icon dropdown
```

## Using Translations in Components

Import the hook and read keys via `t`:
```tsx
import { useTranslation } from "react-i18next";

const { t } = useTranslation();

return <h1>{t("login.title")}</h1>;
```

For strings with markup, wrap the content in your component and reference the key. If interpolation is needed, pass values as the second argument (e.g., `t("dashboard.greeting", { name })`).

## Sidebar Language Switcher

- Located in `LanguageSwitcher` under `components/layout/sidebar`.
- Uses the `Languages` icon from lucide-react.
- Persists the chosen locale in `localStorage` and honors `?lng=<code>` query parameters.
- Update the `LANGUAGE_OPTIONS` array and `supportedLngs` in `lib/i18n.ts` when introducing new locales.

## Adding or Editing Strings

1. Choose the relevant namespace key in each `translation.json` file (e.g., sidebar, userMenu, login).
2. Keep keys consistent across all languages to avoid fallback to English.
3. Use descriptive nested keys: `sidebar.items.myClass` instead of generic names.
4. When removing a key, clean up the JSON entry in every language.

## Adding Another Language

1. Duplicate `src/locales/en/translation.json` into a new folder named after the language code (e.g., `fr`).
2. Translate every value.
3. Register the file in `src/lib/i18n.ts` and add the code to both `supportedLngs` and `LANGUAGE_OPTIONS`.
4. Provide a self-referential language name (e.g., `Français`) for the switcher label.

## Testing Tips

- To force a locale, append `?lng=vi` (or `ja`, `th`) to the URL.
- Clear `localStorage` (key: `i18nextLng`) if the language seems stuck.
- When writing unit tests, mock `i18next` or wrap tested components with `I18nextProvider` using the config from `lib/i18n.ts`.

Keeping translation keys tidy and mirrored across languages ensures a smooth experience for both users and translators. Reach out to the team before restructuring keys so we can coordinate updates across all locale files.
