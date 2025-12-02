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

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
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

const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([dashboardRoute]),
]);

const router = createRouter({ routeTree });

function App() {
  return <RouterProvider router={router} />;
}

export default App;
