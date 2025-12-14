# Ella Component UI
A feature-rich React component UI application for managing classrooms and lesson planning, built with TypeScript and Vite.

## 🏗️ Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Routing:** TanStack Router
- **State:** TanStack Query + Zustand
- **Forms:** TanStack Form + Zod
- **UI:** Radix UI + Tailwind CSS 4
- **i18n:** react-i18next (en, vi, ja, th)

## 📁 Folder Structure

```
src/
├── app/                      # Application core
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   ├── router.tsx           # Route definitions
│   ├── heading/             # Page headings config
│   └── nav-items/           # Sidebar navigation config
│
├── features/                # Feature modules (pages)
│   ├── auth/               # Login, Signup, Forgot Password
│   ├── dashboard.tsx       # Dashboard page
│   ├── lesson-planning/    # Lesson planning feature
│   └── my-class/           # Class management feature
│
├── components/             # Reusable components
│   ├── ui/                # Base UI components (Radix + Tailwind)
│   ├── forms/             # Form components (ClassForm, StudentForm)
│   └── layout/            # Layout components (Sidebar, MainLayout)
│
├── hooks/                  # Custom React hooks
│   ├── auth/              # Authentication hooks (useLogin, useSignup)
│   ├── common/            # Common hooks (useCarousel, useMobile)
│   └── @ella/             # Domain-specific hooks
│
├── services/              # API service layer
│   ├── auth-service.ts   # Authentication API
│   ├── class-service.ts  # Classroom API
│   ├── lesson-service.ts # Lesson API
│   └── student-service.ts # Student API
│
├── stores/                # Global state (Zustand)
│   ├── auth-store.ts     # Auth state
│   └── lesson-store.ts   # Lesson state
│
├── lib/                   # Utilities & config
│   ├── api-client.ts     # Axios instance
│   ├── i18n.ts           # i18n configuration
│   ├── utils.ts          # Helper functions
│   └── route/            # Route guards
│
├── types/                 # TypeScript types
│   ├── auth.ts
│   ├── classroom.ts
│   └── menu.ts
│
└── locales/              # Translation files
    ├── en/
    ├── vi/
    ├── ja/
    └── th/
```

## 🎯 Key Patterns

### **Feature-First Organization**
- Each feature in `features/` is self-contained with its components and logic
- Shared components go in `components/`
- Business logic extracted to custom hooks in `hooks/`

### **Custom Hooks Strategy**
- **Auth hooks** (`hooks/auth/`): Login, signup, password reset logic
- **Common hooks** (`hooks/common/`): Carousel, debounce, mobile detection
- **Separation of concerns**: UI components stay clean, logic in hooks

### **Service Layer**
- All API calls centralized in `services/`
- Uses TanStack Query for data fetching/caching
- Axios interceptors in `lib/api-client.ts` handle auth tokens

### **Type Safety**
- All API responses typed in `types/`
- Zod schemas for runtime validation
- Strict TypeScript configuration

### **Internationalization**
- 4 languages supported
- Lazy-loaded translations for performance
- Namespace-based organization

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Lint & format
pnpm lint:fix
pnpm format
```

## 📝 Adding New Features

1. Create feature folder in `features/[feature-name]/`
2. Add route in `app/router.tsx`
3. Create service in `services/[feature]-service.ts`
4. Add types in `types/[feature].ts`
5. Create custom hooks in `hooks/[category]/`
6. Add translations in `locales/*/translation.json`
7. Update nav items in `app/nav-items/`