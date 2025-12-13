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

interface RouterContext {
  auth: {
    isAuthenticated: boolean;
  };
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
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
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: Signup,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPassword,
});

const noPermissionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/no-permission",
  component: NoPermissionPage,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: MainLayout,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
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
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  noPermissionRoute,
  layoutRoute.addChildren([dashboardRoute, lessonPlanningRoute, myClassRoute]),
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
