import { useStore } from "@tanstack/react-store";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import {
  authStore,
  authActions,
  selectUser,
  selectIsAuthenticated,
  selectToken,
} from "@/stores/auth-store";
import type { LoginResponseDto, User } from "@/types/auth";

export function useAuth() {
  const user = useStore(authStore, selectUser);
  const isAuthenticated = useStore(authStore, selectIsAuthenticated);
  const token = useStore(authStore, selectToken);
  const navigate = useNavigate();

  const login = useCallback((response: LoginResponseDto) => {
    authActions.login(response);
  }, []);

  const logout = useCallback(() => {
    authActions.logout();
    navigate({ to: "/auth/login" });
  }, [navigate]);

  const setUser = useCallback((newUser: User) => {
    authActions.setUser(newUser);
  }, []);

  return {
    user,
    isAuthenticated,
    token,
    login,
    logout,
    setUser,
  };
}
