// src/App.tsx
import { RouterProvider } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { authStore } from "./stores/auth-store";
import { router } from "./router";

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
