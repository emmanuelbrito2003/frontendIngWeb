import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-4">
            <div class="card login-card">
              <div class="card-body p-5">
                <!-- Header -->
                <div class="text-center mb-4">
                  <i class="bi bi-building display-4 text-primary"></i>
                  <h2 class="card-title mt-3 mb-1">Sistema de Empleados</h2>
                  <p class="text-muted">Inicia sesión para continuar</p>
                </div>

                <!-- Alert de error -->
                <div
                  *ngIf="errorMessage"
                  class="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  <i class="bi bi-exclamation-triangle-fill"></i>
                  {{ errorMessage }}
                  <button
                    type="button"
                    class="btn-close"
                    (click)="clearError()"
                    aria-label="Close"
                  ></button>
                </div>

                <!-- Alert de éxito -->
                <div
                  *ngIf="successMessage"
                  class="alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  <i class="bi bi-check-circle-fill"></i>
                  {{ successMessage }}
                  <button
                    type="button"
                    class="btn-close"
                    (click)="clearSuccess()"
                    aria-label="Close"
                  ></button>
                </div>

                <!-- Formulario de login -->
                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                  <!-- Email -->
                  <div class="mb-3">
                    <label for="email" class="form-label">
                      <i class="bi bi-envelope"></i>
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      formControlName="email"
                      placeholder="ejemplo@empresa.com"
                      [class.is-invalid]="isFieldInvalid('email')"
                      [class.is-valid]="isFieldValid('email')"
                    />
                    <div
                      *ngIf="isFieldInvalid('email')"
                      class="invalid-feedback"
                    >
                      <span
                        *ngIf="loginForm.get('email')?.errors?.['required']"
                      >
                        El email es obligatorio
                      </span>
                      <span *ngIf="loginForm.get('email')?.errors?.['email']">
                        Ingresa un email válido
                      </span>
                    </div>
                  </div>

                  <!-- Password -->
                  <div class="mb-4">
                    <label for="password" class="form-label">
                      <i class="bi bi-lock"></i>
                      Contraseña
                    </label>
                    <div class="input-group">
                      <input
                        [type]="showPassword ? 'text' : 'password'"
                        class="form-control"
                        id="password"
                        formControlName="password"
                        placeholder="Ingresa tu contraseña"
                        [class.is-invalid]="isFieldInvalid('password')"
                        [class.is-valid]="isFieldValid('password')"
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        (click)="togglePassword()"
                      >
                        <i
                          [class]="
                            showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
                          "
                        ></i>
                      </button>
                    </div>
                    <div
                      *ngIf="isFieldInvalid('password')"
                      class="invalid-feedback"
                    >
                      <span
                        *ngIf="loginForm.get('password')?.errors?.['required']"
                      >
                        La contraseña es obligatoria
                      </span>
                      <span
                        *ngIf="loginForm.get('password')?.errors?.['minlength']"
                      >
                        La contraseña debe tener al menos 3 caracteres
                      </span>
                    </div>
                  </div>

                  <!-- Botón de login -->
                  <div class="d-grid">
                    <button
                      type="submit"
                      class="btn btn-primary btn-lg"
                      [disabled]="loginForm.invalid || isLoading"
                    >
                      <span
                        *ngIf="isLoading"
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                      >
                      </span>
                      <i
                        *ngIf="!isLoading"
                        class="bi bi-box-arrow-in-right me-2"
                      ></i>
                      {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                    </button>
                  </div>
                </form>

                <!-- Información de cuentas de prueba -->
                <div class="mt-4 pt-3 border-top">
                  <h6 class="text-muted text-center mb-3">Cuentas de Prueba</h6>
                  <div class="row text-center">
                    <div class="col-6">
                      <div class="card bg-light">
                        <div class="card-body py-2">
                          <h6 class="card-title mb-1">
                            <span class="badge badge-admin">ADMIN</span>
                          </h6>
                          <small class="text-muted">
                            admin&#64;empresa.com<br />
                            admin123
                          </small>
                        </div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="card bg-light">
                        <div class="card-body py-2">
                          <h6 class="card-title mb-1">
                            <span class="badge badge-empleado">EMPLEADO</span>
                          </h6>
                          <small class="text-muted">
                            empleado&#64;empresa.com<br />
                            empleado123
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 0;
      }

      .login-card {
        background: white;
        border-radius: 1rem;
        box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
        border: none;
        backdrop-filter: blur(10px);
      }

      .bi {
        margin-right: 0.5rem;
      }

      .form-control {
        padding: 0.75rem 1rem;
        font-size: 1rem;
        border-radius: 0.5rem;
      }

      .btn-lg {
        padding: 0.75rem 1.5rem;
        font-size: 1.1rem;
        border-radius: 0.5rem;
        font-weight: 600;
      }

      .badge-admin {
        background-color: #6f42c1;
        color: white;
      }

      .badge-empleado {
        background-color: #20c997;
        color: white;
      }

      .input-group .btn {
        border-left: none;
      }

      .card.bg-light {
        border: 1px solid #e9ecef;
      }

      .alert {
        border-radius: 0.5rem;
        border: none;
        font-weight: 500;
      }

      .form-control.is-valid {
        background-image: none;
      }

      .form-control.is-invalid {
        background-image: none;
      }

      .spinner-border-sm {
        width: 1rem;
        height: 1rem;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir según rol
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getCurrentRole();
      if (role === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/profile']);
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.clearMessages();

      const credentials: LoginRequest = {
        email: this.loginForm.value.email.trim(),
        password: this.loginForm.value.password,
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Inicio de sesión exitoso. Redirigiendo...';
            // El servicio ya maneja la redirección automáticamente
          } else {
            this.errorMessage = response.message || 'Error al iniciar sesión';
          }
        },
        error: (error) => {
          this.isLoading = false;
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage =
              'Error de conexión. Verifica que el servidor esté funcionando.';
          }
          console.error('Error en login:', error);
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.valid && (field.dirty || field.touched));
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.errorMessage = '';
  }

  clearSuccess(): void {
    this.successMessage = '';
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
