import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { AuthService } from '../../services/auth.service';
import { Empleado } from '../../models/empleado.interface';
import { UserInfo } from '../../models/auth.interface';

@Component({
  selector: 'app-empleado-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleado-profile.component.html',
  styleUrls: ['./empleado-profile.component.css']
})
export class EmpleadoProfileComponent implements OnInit {
  empleado: Empleado | null = null;
  currentUser: UserInfo | null = null;
  
  // Estados
  isLoading = false;
  showPassword = false;

  // Formulario
  formData: any = {
    nombre: '',
    telefono: '',
    password: ''
  };

  // Datos originales para comparar cambios
  originalData: any = {};

  // Alertas
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private empleadoService: EmpleadoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserInfo();
    if (this.currentUser?.id) {
      this.loadProfile();
    }
  }

  loadProfile(): void {
    if (!this.currentUser?.id) return;

    this.isLoading = true;
    this.empleadoService.getEmpleadoById(this.currentUser.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.empleado = response.data;
          this.initializeForm();
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.showAlert('Error al cargar perfil: ' + error.message, 'error');
        this.isLoading = false;
      }
    });
  }

  initializeForm(): void {
    if (this.empleado) {
      this.formData = {
        nombre: this.empleado.nombre,
        telefono: this.empleado.telefono || '',
        password: ''
      };

      // Guardar datos originales
      this.originalData = { ...this.formData };
    }
  }

  updateProfile(): void {
    if (!this.empleado?.id) return;

    this.isLoading = true;

    // Preparar datos para enviar (solo campos que puede editar el empleado)
    const updateData: any = {
      nombre: this.formData.nombre,
      telefono: this.formData.telefono
    };

    // Solo agregar password si se proporcionó uno nuevo
    if (this.formData.password && this.formData.password.trim().length > 0) {
      updateData.password = this.formData.password;
    }

    this.empleadoService.updateEmpleado(this.empleado.id, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showAlert('Perfil actualizado exitosamente', 'success');
          
          // Actualizar la información del usuario en el servicio de auth
          if (this.formData.nombre !== this.originalData.nombre) {
            this.authService.updateUserInfo({ nombre: this.formData.nombre });
          }
          
          // Recargar perfil para obtener datos actualizados
          this.loadProfile();
          
          // Limpiar password del formulario
          this.formData.password = '';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.showAlert('Error al actualizar perfil: ' + error.message, 'error');
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.formData = { ...this.originalData };
    this.formData.password = ''; // Siempre limpiar password
  }

  hasChanges(): boolean {
    return (
      this.formData.nombre !== this.originalData.nombre ||
      this.formData.telefono !== this.originalData.telefono ||
      (this.formData.password && this.formData.password.trim().length > 0)
    );
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string, form: any): boolean {
    const field = form.controls[fieldName];
    return field && field.invalid && (field.dirty || field.touched);
  }

  isFieldValid(fieldName: string, form: any): boolean {
    const field = form.controls[fieldName];
    return field && field.valid && (field.dirty || field.touched);
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      this.clearAlert();
    }, 5000);
  }

  clearAlert(): void {
    this.alertMessage = '';
  }
}