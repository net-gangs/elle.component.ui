import { useStore } from "@tanstack/react-store";
import { useNavigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { useEffect, useState, useRef } from "react";
import {
  authStore,
  authActions,
  selectIsAuthenticated,
  selectUser,
  selectToken,
} from "@/stores/auth-store";
import { authService } from "@/services/auth-service";

type Props = {
  allowedRoles?: string[];
};

const ProtectedRoute = ({ allowedRoles, children }: PropsWithChildren<Props>) => {
  const isAuthenticated = useStore(authStore, selectIsAuthenticated);
  const user = useStore(authStore, selectUser);
  const token = useStore(authStore, selectToken);
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const hasFetchedUser = useRef(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const currentPath = window.location.pathname;

  
      if (isAuthenticated && currentPath === "/login") {
        navigate({ to: "/" });
        return;
      }

      if (token && !user && !hasFetchedUser.current) {
        hasFetchedUser.current = true;
        try {
          const fetchedUser = await authService.me();
          authActions.setUser(fetchedUser);
          setIsChecking(false);
          return;
        } catch {
         
          authActions.logout();
          navigate({ to: "/login" });
          return;
        }
      }
      if (!isAuthenticated && !token) {
        navigate({ to: "/login" });
        return;
      }

      if (
        isAuthenticated &&
        user &&
        allowedRoles &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role.name)
      ) {
        navigate({ to: "/no-permission" });
        return;
      }

      setIsChecking(false);
    };

    verifyAuth();
  }, [isAuthenticated, user, token, allowedRoles, navigate]);

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
