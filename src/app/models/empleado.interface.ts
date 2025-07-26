export interface Empleado {
  id?: string;
  nombre: string;
  email: string;
  password?: string;
  cargo: string;
  departamento: string;
  salario: number;
  fechaIngreso: string; // Format: YYYY-MM-DD
  telefono?: string;
  rol: 'ADMIN' | 'EMPLEADO';
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface EmpleadoCreate {
  nombre: string;
  email: string;
  password: string;
  cargo: string;
  departamento: string;
  salario: number;
  fechaIngreso: string;
  telefono?: string;
  rol: 'ADMIN' | 'EMPLEADO';
}

export interface EmpleadoUpdate {
  nombre: string;
  email?: string;
  password?: string;
  cargo?: string;
  departamento?: string;
  salario?: number;
  fechaIngreso?: string;
  telefono?: string;
  rol?: 'ADMIN' | 'EMPLEADO';
}
