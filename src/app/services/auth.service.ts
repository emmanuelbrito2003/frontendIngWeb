import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  UserInfo,
  ApiResponse,
  JwtPayload,
} from '../models/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_info';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Verificar si hay token al inicializar el servicio
    this.checkTokenOnInit();
  }

  // Verificar token al inicializar
  private checkTokenOnInit(): void {
    const token = this.getToken();
    const userInfo = this.getUserInfo();

    if (token && userInfo && this.isTokenValid(token)) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(userInfo);
    } else {
      this.logout();
    }
  }

  // Login
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(
        `${this.API_URL}/auth/login`,
        credentials
      )
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        }),
        catchError((error) => {
          console.error('Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  // Establecer sesión
  private setSession(loginResponse: LoginResponse): void {
    const userInfo: UserInfo = {
      id: loginResponse.id,
      email: loginResponse.email,
      nombre: loginResponse.nombre,
      rol: loginResponse.rol,
      cargo: loginResponse.cargo,
      departamento: loginResponse.departamento,
      token: loginResponse.token,
    };

    // Guardar en localStorage
    localStorage.setItem(this.TOKEN_KEY, loginResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));

    // Actualizar subjects
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(userInfo);

    // Redirigir según rol
    if (loginResponse.rol === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/profile']);
    }
  }

  // Logout
  logout(): void {
    // Limpiar localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Actualizar subjects
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);

    // Redirigir a login
    this.router.navigate(['/login']);
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Obtener información del usuario
  getUserInfo(): UserInfo | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && this.isTokenValid(token);
  }

  // Verificar si es admin
  isAdmin(): boolean {
    const user = this.getUserInfo();
    return user?.rol === 'ADMIN';
  }

  // Verificar si es empleado
  isEmpleado(): boolean {
    const user = this.getUserInfo();
    return user?.rol === 'EMPLEADO';
  }

  // Obtener rol actual
  getCurrentRole(): 'ADMIN' | 'EMPLEADO' | null {
    const user = this.getUserInfo();
    return user?.rol || null;
  }

  // Obtener ID del usuario actual
  getCurrentUserId(): string | null {
    const user = this.getUserInfo();
    return user?.id || null;
  }

  // Verificar si el token es válido
  private isTokenValid(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  }

  // Decodificar token JWT
  private decodeToken(token: string): JwtPayload {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  // Verificar token en el servidor (opcional)
  verifyToken(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/auth/verify`, {});
  }

  // Obtener información del usuario actual del servidor
  getCurrentUser(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/auth/me`);
  }

  // Actualizar información del usuario en localStorage
  updateUserInfo(userInfo: Partial<UserInfo>): void {
    const currentUser = this.getUserInfo();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userInfo };
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }

  // Probar conexión con el backend
  testConnection(): Observable<any> {
    return this.http.get(`http://localhost:8080/api/empleados/estadisticas`).pipe(
      catchError(error => {
        console.error('Error en testConnection:', error);
        return throwError(() => error);
      })
    );
  }
}
