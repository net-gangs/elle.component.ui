import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { authStore } from "./stores/auth-store";

import { MainLayout } from "./components/layout/main-layout";
import Dashboard from "./pages/dashboard";
import LessonPlanning from "./pages/lesson-planning/lesson-planning";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import ForgotPassword from "./pages/auth/forgot-password";
import MyClassPage from "./pages/class/my-class-page";
import NoPermissionPage from "./lib/route/NoPermissionPage";
import PasswordChange from "./pages/auth/password-change";
import z from "zod";
import ConfirmEmailAction from "./pages/auth/confirm-email-action";

interface RouterContext {
  auth: {
    isAuthenticated: boolean;
  };
}

const hashSchema = z.object({
  hash: z.string().optional(),
});

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: MainLayout,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

const authLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: () => <Outlet />,
});

export const passwordChangeRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/auth/password-change",
  component: PasswordChange,
  validateSearch: (search) => hashSchema.parse(search),
  beforeLoad: ({ search }) => {
    if (!search.hash) {
      throw redirect({ to: "/auth/forgot-password" });
    }
  },
});

export const confirmEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/confirm-email",
  validateSearch: (search) => hashSchema.parse(search),
  beforeLoad: ({ search }) => {
    if (!search.hash) {
      throw redirect({ to: "/" });
    }
  },
  component: ConfirmEmailAction,
});

const loginRoute = createRoute({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/",
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  getParentRoute: () => authLayout,
  path: "/auth/login",
  component: Login,
});

const signupRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/auth/signup",
  component: Signup,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/auth/forgot-password",
  component: ForgotPassword,
});

const noPermissionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/no-permission",
  component: NoPermissionPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/dashboard",
  component: Dashboard,
});

const lessonPlanningRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/lesson-planning",
  component: LessonPlanning,
});

const myClassRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: MyClassPage,
});

const routeTree = rootRoute.addChildren([
  authLayout.addChildren([
    loginRoute,
    signupRoute,
    forgotPasswordRoute,
    passwordChangeRoute,
  ]),
  layoutRoute.addChildren([dashboardRoute, lessonPlanningRoute, myClassRoute]),
  confirmEmailRoute,
  noPermissionRoute,
]);

const router = createRouter({
  routeTree,
  context: {
    auth: { isAuthenticated: false },
  },
});

function App() {
  const authState = useStore(authStore);
  return (
    <RouterProvider
      router={router}
      context={{
        auth: { isAuthenticated: authState.isAuthenticated },
      }}
    />
  );
}

export default App;
