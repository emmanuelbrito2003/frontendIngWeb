import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { AuthService } from '../../services/auth.service';
import { Empleado, EmpleadoCreate } from '../../models/empleado.interface';
import { EmpleadoEstadisticas } from '../../models/api.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  estadisticas: EmpleadoEstadisticas | null = null;
  
  // Estados
  isLoading = false;
  showCreateForm = false;
  editingEmpleado: Empleado | null = null;
  currentUserId: string | null = null;

  // Filtros
  searchTerm = '';
  departamentoFilter = '';
  rolFilter = '';
  departamentos: string[] = [];

  // Formulario
  formData: any = this.getEmptyFormData();

  // Alertas
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private empleadoService: EmpleadoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.loadEmpleados();
    this.loadEstadisticas();
  }

  loadEmpleados(): void {
    this.isLoading = true;
    this.empleadoService.getAllEmpleados().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.empleados = response.data;
          this.empleadosFiltrados = [...this.empleados];
          this.departamentos = this.empleadoService.getDepartamentosUnicos(this.empleados);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.showAlert('Error al cargar empleados: ' + error.message, 'error');
        this.isLoading = false;
      }
    });
  }

  loadEstadisticas(): void {
    this.empleadoService.getEstadisticas().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.estadisticas = response.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }

  filterEmpleados(): void {
    this.empleadosFiltrados = this.empleados.filter(empleado => {
      const matchesSearch = !this.searchTerm || 
        empleado.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        empleado.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDepartamento = !this.departamentoFilter || 
        empleado.departamento === this.departamentoFilter;
      
      const matchesRol = !this.rolFilter || empleado.rol === this.rolFilter;
      
      return matchesSearch && matchesDepartamento && matchesRol;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.departamentoFilter = '';
    this.rolFilter = '';
    this.filterEmpleados();
  }

  editEmpleado(empleado: Empleado): void {
    this.editingEmpleado = empleado;
    this.formData = {
      nombre: empleado.nombre,
      email: empleado.email,
      cargo: empleado.cargo,
      departamento: empleado.departamento,
      salario: empleado.salario,
      fechaIngreso: empleado.fechaIngreso,
      telefono: empleado.telefono || '',
      rol: empleado.rol
    };
  }

  deleteEmpleado(empleado: Empleado): void {
    if (empleado.id === this.currentUserId) {
      this.showAlert('No puedes eliminar tu propio usuario', 'error');
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar a ${empleado.nombre}?`)) {
      this.isLoading = true;
      this.empleadoService.deleteEmpleado(empleado.id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.showAlert('Empleado eliminado exitosamente', 'success');
            this.loadEmpleados();
            this.loadEstadisticas();
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.showAlert('Error al eliminar empleado: ' + error.message, 'error');
          this.isLoading = false;
        }
      });
    }
  }

  submitForm(): void {
    this.isLoading = true;

    if (this.editingEmpleado) {
      // Actualizar empleado existente
      this.empleadoService.updateEmpleado(this.editingEmpleado.id!, this.formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.showAlert('Empleado actualizado exitosamente', 'success');
            this.cancelForm();
            this.loadEmpleados();
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.showAlert('Error al actualizar empleado: ' + error.message, 'error');
          this.isLoading = false;
        }
      });
    } else {
      // Crear nuevo empleado
      const nuevoEmpleado: EmpleadoCreate = this.formData;
      this.empleadoService.createEmpleado(nuevoEmpleado).subscribe({
        next: (response) => {
          if (response.success) {
            this.showAlert('Empleado creado exitosamente', 'success');
            this.cancelForm();
            this.loadEmpleados();
            this.loadEstadisticas();
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.showAlert('Error al crear empleado: ' + error.message, 'error');
          this.isLoading = false;
        }
      });
    }
  }

  cancelForm(): void {
    this.showCreateForm = false;
    this.editingEmpleado = null;
    this.formData = this.getEmptyFormData();
  }

  private getEmptyFormData(): any {
    return {
      nombre: '',
      email: '',
      password: '',
      cargo: '',
      departamento: '',
      salario: 0,
      fechaIngreso: '',
      telefono: '',
      rol: ''
    };
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

  trackByEmpleado(index: number, empleado: Empleado): string {
    return empleado.id || index.toString();
  }
}