import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import { MainLayout } from "./components/layout/main-layout";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import MyClassPage from "./pages/class/MyClassPage";
import NoPermissionPage from "./lib/route/NoPermissionPage";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
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
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: Dashboard,
});

const myClassRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/my-class",
  component: MyClassPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  noPermissionRoute,
  layoutRoute.addChildren([dashboardRoute, myClassRoute]),
]);

const router = createRouter({ routeTree });



function App() {
  return (

      <RouterProvider router={router} />

  );
}

export default App;
