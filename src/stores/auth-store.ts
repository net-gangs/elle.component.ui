import { Store } from '@tanstack/react-store';

interface AuthState {
  token: string | null;
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
}

const savedToken = localStorage.getItem('token');

export const authStore = new Store<AuthState>({
  token: savedToken,
  user: null,
  isAuthenticated: !!savedToken,
});

export const login = (token: string, user: any) => {
  localStorage.setItem('token', token);
  authStore.setState((state) => ({
    ...state,
    token,
    user,
    isAuthenticated: true,
  }));
};

export const logout = () => {
  localStorage.removeItem('token');
  authStore.setState((state) => ({
    ...state,
    token: null,
    user: null,
    isAuthenticated: false,
  }));
};