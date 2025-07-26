import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ApiResponse, LoginResponse } from '../../models/auth.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated', 'getCurrentRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default behavior
    authService.isAuthenticated.and.returnValue(false);
    authService.getCurrentRole.and.returnValue(null);

    fixture.detectChanges();
  });

  // PRUEBA 1: Formulario debe ser inválido con campos vacíos
  it('should have invalid form when fields are empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
    expect(component.loginForm.get('email')?.invalid).toBeTruthy();
    expect(component.loginForm.get('password')?.invalid).toBeTruthy();
  });

  // PRUEBA 2: Login exitoso debe llamar al servicio y mostrar éxito
  it('should login successfully with valid credentials', () => {
    // Arrange
    const mockResponse: ApiResponse<LoginResponse> = {
      success: true,
      message: 'Login exitoso',
      data: {
        token: 'fake-token',
        tipo: 'Bearer',
        id: '123',
        nombre: 'Admin',
        email: 'admin@empresa.com',
        rol: 'ADMIN',
        cargo: 'Admin',
        departamento: 'Admin'
      },
      timestamp: new Date().toISOString()
    };

    authService.login.and.returnValue(of(mockResponse));

    // Act
    component.loginForm.patchValue({
      email: 'admin@empresa.com',
      password: 'admin123'
    });

    component.onSubmit();

    // Assert
    expect(authService.login).toHaveBeenCalledWith({
      email: 'admin@empresa.com',
      password: 'admin123'
    });
    expect(component.successMessage).toBe('Inicio de sesión exitoso. Redirigiendo...');
    expect(component.isLoading).toBeFalse();
  });

  // PRUEBA 3: Login fallido debe mostrar error
  it('should show error message on login failure', () => {
    // Arrange
    const errorResponse = {
      error: {
        message: 'Credenciales inválidas'
      }
    };

    authService.login.and.returnValue(throwError(() => errorResponse));

    // Act
    component.loginForm.patchValue({
      email: 'admin@empresa.com',
      password: 'wrong-password'
    });

    component.onSubmit();

    // Assert
    expect(authService.login).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Credenciales inválidas');
    expect(component.isLoading).toBeFalse();
  });
});