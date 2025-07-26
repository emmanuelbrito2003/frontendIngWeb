import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginRequest, ApiResponse, LoginResponse } from '../models/auth.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // PRUEBA 1: Login exitoso
  it('should login successfully with valid credentials', () => {
    // Arrange
    const loginRequest: LoginRequest = {
      email: 'admin@empresa.com',
      password: 'admin123'
    };

    const mockResponse: ApiResponse<LoginResponse> = {
      success: true,
      message: 'Login exitoso',
      data: {
        token: 'fake-jwt-token',
        tipo: 'Bearer',
        id: '123',
        nombre: 'Administrador',
        email: 'admin@empresa.com',
        rol: 'ADMIN',
        cargo: 'Administrador General',
        departamento: 'Administración'
      },
      timestamp: new Date().toISOString()
    };

    // Act
    service.login(loginRequest).subscribe(response => {
      // Assert
      expect(response.success).toBe(true);
      expect(response.data?.token).toBe('fake-jwt-token');
      expect(response.data?.rol).toBe('ADMIN');
      expect(localStorage.getItem('auth_token')).toBe('fake-jwt-token');
      expect(router.navigate).toHaveBeenCalledWith(['/admin']);
    });

    // Simular respuesta HTTP
    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginRequest);
    req.flush(mockResponse);
  });

  // PRUEBA 2: Verificar autenticación con token válido
  it('should return true for valid authentication', () => {
    // Arrange
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBlbXByZXNhLmNvbSIsInJvbCI6IkFETUlOIiwiaWQiOiIxMjMiLCJpYXQiOjE2MDA5NzIwMDAsImV4cCI6OTk5OTk5OTk5OX0.fake-signature';
    const userInfo = {
      id: '123',
      email: 'admin@empresa.com',
      nombre: 'Administrador',
      rol: 'ADMIN' as const,
      cargo: 'Administrador General',
      departamento: 'Administración',
      token: validToken
    };

    // Simular token y usuario en localStorage
    localStorage.setItem('auth_token', validToken);
    localStorage.setItem('user_info', JSON.stringify(userInfo));

    // Act
    const isAuthenticated = service.isAuthenticated();
    const currentUser = service.getUserInfo();
    const isAdmin = service.isAdmin();

    // Assert
    expect(isAuthenticated).toBe(true);
    expect(currentUser?.email).toBe('admin@empresa.com');
    expect(currentUser?.rol).toBe('ADMIN');
    expect(isAdmin).toBe(true);
  });
});