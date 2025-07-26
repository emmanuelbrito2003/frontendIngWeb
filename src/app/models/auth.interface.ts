export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    tipo: string;
    id: string;
    nombre: string;
    email: string;
    rol: 'ADMIN' | 'EMPLEADO';
    cargo: string;
    departamento: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    timestamp: string;
  }
  
  export interface UserInfo {
    id: string;
    email: string;
    nombre: string;
    rol: 'ADMIN' | 'EMPLEADO';
    cargo: string;
    departamento: string;
    token: string;
  }
  
  export interface JwtPayload {
    sub: string; // email
    rol: string;
    id: string;
    iat: number;
    exp: number;
  }