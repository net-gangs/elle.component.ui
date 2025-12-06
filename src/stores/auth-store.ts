import { Store } from "@tanstack/react-store";
import type {
  AuthState,
  LoginResponseDto,
  RefreshResponseDto,
  User,
} from "@/types/auth";

const STORAGE_KEYS = {
  TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  TOKEN_EXPIRES: "token_expires",
  USER: "user",
} as const;

const loadStoredAuth = (): AuthState => {
  try {

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const tokenExpiresStr = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);

    const tokenExpires = tokenExpiresStr ? parseInt(tokenExpiresStr, 10) : null;
    const user = userStr ? JSON.parse(userStr) : null;

    const isExpired = tokenExpires ? Date.now() > tokenExpires : false;

    if (token && !isExpired) {
      return {
        token,
        refreshToken,
        tokenExpires,
        user,
        isAuthenticated: true,
      };
    }

    if (isExpired && refreshToken) {
      return {
        token: null,
        refreshToken,
        tokenExpires: null,
        user: null,
        isAuthenticated: false,
      };
    }

    return {
      token: null,
      refreshToken: null,
      tokenExpires: null,
      user: null,
      isAuthenticated: false,
    };
  } catch {
    return {
      token: null,
      refreshToken: null,
      tokenExpires: null,
      user: null,
      isAuthenticated: false,
    };
  }
};

const persistAuth = (state: AuthState) => {
  if (state.token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, state.token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  if (state.refreshToken) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, state.refreshToken);
  } else {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  if (state.tokenExpires) {
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES, state.tokenExpires.toString());
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES);
  }

  if (state.user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const authStore = new Store<AuthState>(loadStoredAuth());

export const authActions = {
  login: (response: LoginResponseDto) => {
    const newState: AuthState = {
      token: response.token,
      refreshToken: response.refreshToken,
      tokenExpires: response.tokenExpires,
      user: response.user,
      isAuthenticated: true,
    };
    authStore.setState(() => newState);
    persistAuth(newState);
  },

  logout: () => {
    const newState: AuthState = {
      token: null,
      refreshToken: null,
      tokenExpires: null,
      user: null,
      isAuthenticated: false,
    };
    authStore.setState(() => newState);
    clearAuth();
  },

  refresh: (response: RefreshResponseDto) => {
    authStore.setState((state) => {
      const newState: AuthState = {
        ...state,
        token: response.token,
        refreshToken: response.refreshToken,
        tokenExpires: response.tokenExpires,
      };
      persistAuth(newState);
      return newState;
    });
  },

  setUser: (user: User) => {
    authStore.setState((state) => {
      const newState: AuthState = {
        ...state,
        user,
      };
      persistAuth(newState);
      return newState;
    });
  },
  getToken: (): string | null => {
    return authStore.state.token;
  },

  getRefreshToken: (): string | null => {
    return authStore.state.refreshToken;
  },

  isAuthenticated: (): boolean => {
    return authStore.state.isAuthenticated;
  },
};

export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectToken = (state: AuthState) => state.token;