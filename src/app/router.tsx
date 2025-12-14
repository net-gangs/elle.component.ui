import {
    createRootRouteWithContext,
    createRoute,
    createRouter,
    Outlet,
    redirect,
    lazyRouteComponent
} from "@tanstack/react-router";

import { MainLayout } from "../components/layout/main-layout";
import z from "zod";
const PasswordChange = lazyRouteComponent(() => import("../features/auth/password-change"));
const ConfirmEmailAction = lazyRouteComponent(() => import("../features/auth/confirm-email-action"));

const Login = lazyRouteComponent(() => import("../features/auth/login"));
const Signup = lazyRouteComponent(() => import("../features/auth/signup"));
const ForgotPassword = lazyRouteComponent(() => import("../features/auth/forgot-password"));
const Dashboard = lazyRouteComponent(() => import("../features/dashboard"));
const LessonPlanning = lazyRouteComponent(() => import("../features/lesson-planning"));
const MyClassPage = lazyRouteComponent(() => import("../features/my-class/index"));
const NoPermissionPage = lazyRouteComponent(() => import("../lib/route/NoPermissionPage"));


export interface RouterContext {
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

export const router = createRouter({
  routeTree,
  context: {
    auth: { isAuthenticated: false },
  },
});
