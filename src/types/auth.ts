// Auth types based on OpenAPI spec

export interface FileType {
  id: string;
  path: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Status {
  id: number;
  name: string;
}

export interface User {
  id: string;
  email: string;
  provider: string;
  socialId: string | null;
  firstName: string;
  lastName: string;
  photo: FileType | null;
  role: Role;
  status: Status;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LoginResponseDto {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: User;
}

export interface RefreshResponseDto {
  token: string;
  refreshToken: string;
  tokenExpires: number;
}

export interface AuthEmailLoginDto {
  email: string;
  password: string;
}

export interface AuthRegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthForgotPasswordDto {
  email: string;
}

export interface AuthResetPasswordDto {
  password: string;
  hash: string;
}

export interface AuthGoogleLoginDto {
  code: string;
}

export interface AuthFacebookLoginDto {
  accessToken: string;
}

export interface AuthAppleLoginDto {
  idToken: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  tokenExpires: number | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  login: (response: LoginResponseDto) => void;
  logout: () => void;
  refresh: (response: RefreshResponseDto) => void;
  setUser: (user: User) => void;
}
