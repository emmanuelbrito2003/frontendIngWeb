import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Empleado,
  EmpleadoCreate,
  EmpleadoUpdate,
} from '../models/empleado.interface';
import { ApiResponse } from '../models/auth.interface';
import { EmpleadoEstadisticas } from '../models/api.interface';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private readonly API_URL = `${environment.apiUrl}/empleados`;

  constructor(private http: HttpClient) {}

  // Obtener todos los empleados (solo ADMIN)
  getAllEmpleados(): Observable<ApiResponse<Empleado[]>> {
    return this.http.get<ApiResponse<Empleado[]>>(this.API_URL).pipe(
      tap((response) => console.log('Empleados obtenidos:', response)),
      catchError(this.handleError)
    );
  }

  // Obtener empleado por ID
  getEmpleadoById(id: string): Observable<ApiResponse<Empleado>> {
    return this.http.get<ApiResponse<Empleado>>(`${this.API_URL}/${id}`).pipe(
      tap((response) => console.log('Empleado obtenido:', response)),
      catchError(this.handleError)
    );
  }

  // Crear nuevo empleado (solo ADMIN)
  createEmpleado(empleado: EmpleadoCreate): Observable<ApiResponse<Empleado>> {
    return this.http.post<ApiResponse<Empleado>>(this.API_URL, empleado).pipe(
      tap((response) => console.log('Empleado creado:', response)),
      catchError(this.handleError)
    );
  }

  // Actualizar empleado
  updateEmpleado(
    id: string,
    empleado: EmpleadoUpdate
  ): Observable<ApiResponse<Empleado>> {
    return this.http
      .put<ApiResponse<Empleado>>(`${this.API_URL}/${id}`, empleado)
      .pipe(
        tap((response) => console.log('Empleado actualizado:', response)),
        catchError(this.handleError)
      );
  }

  // Eliminar empleado (solo ADMIN)
  deleteEmpleado(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/${id}`).pipe(
      tap((response) => console.log('Empleado eliminado:', response)),
      catchError(this.handleError)
    );
  }

  // Buscar empleados por departamento (solo ADMIN)
  buscarPorDepartamento(
    departamento: string
  ): Observable<ApiResponse<Empleado[]>> {
    return this.http
      .get<ApiResponse<Empleado[]>>(
        `${this.API_URL}/buscar/departamento/${departamento}`
      )
      .pipe(
        tap((response) => console.log('Empleados por departamento:', response)),
        catchError(this.handleError)
      );
  }

  // Buscar empleados por cargo (solo ADMIN)
  buscarPorCargo(cargo: string): Observable<ApiResponse<Empleado[]>> {
    return this.http
      .get<ApiResponse<Empleado[]>>(`${this.API_URL}/buscar/cargo/${cargo}`)
      .pipe(
        tap((response) => console.log('Empleados por cargo:', response)),
        catchError(this.handleError)
      );
  }

  // Buscar empleados por nombre (solo ADMIN)
  buscarPorNombre(nombre: string): Observable<ApiResponse<Empleado[]>> {
    return this.http
      .get<ApiResponse<Empleado[]>>(`${this.API_URL}/buscar/nombre/${nombre}`)
      .pipe(
        tap((response) => console.log('Empleados por nombre:', response)),
        catchError(this.handleError)
      );
  }

  // Obtener estadísticas (solo ADMIN)
  getEstadisticas(): Observable<ApiResponse<EmpleadoEstadisticas>> {
    return this.http
      .get<ApiResponse<EmpleadoEstadisticas>>(`${this.API_URL}/estadisticas`)
      .pipe(
        tap((response) => console.log('Estadísticas obtenidas:', response)),
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Solicitud inválida. Verifica los datos enviados.';
            break;
          case 401:
            errorMessage = 'No autorizado. Inicia sesión nuevamente.';
            break;
          case 403:
            errorMessage = 'No tienes permisos para realizar esta acción.';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor.';
            break;
          default:
            errorMessage = `Error: ${error.status} - ${error.statusText}`;
        }
      }
    }

    console.error('Error en EmpleadoService:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Utilidad para formatear fecha para el backend
  formatDateForBackend(date: string | Date): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  }

  // Utilidad para validar email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Utilidad para validar salario
  isValidSalary(salario: number): boolean {
    return salario > 0 && salario <= 1000000; // Máximo 1 millón
  }

  // Utilidad para obtener departamentos únicos
  getDepartamentosUnicos(empleados: Empleado[]): string[] {
    const departamentos = empleados.map((emp) => emp.departamento);
    return [...new Set(departamentos)].sort();
  }

  // Utilidad para obtener cargos únicos
  getCargosUnicos(empleados: Empleado[]): string[] {
    const cargos = empleados.map((emp) => emp.cargo);
    return [...new Set(cargos)].sort();
  }
}
