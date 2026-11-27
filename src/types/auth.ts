export interface LoginRequest {
  username: string;
  password: string;
}

// Відповідь POST /auth/login (refreshToken у базовій частині не використовується)
export interface ApiLoginResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Відповідь GET /auth/me
export interface ApiAuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}
