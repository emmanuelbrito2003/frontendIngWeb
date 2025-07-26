export interface ApiError {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
  }
  
  export interface ApiSuccess<T> {
    success: true;
    message: string;
    data: T;
    timestamp: string;
  }
  
  export interface ApiFailure {
    success: false;
    message: string;
    timestamp: string;
    data?: any;
  }
  
  export type ApiResult<T> = ApiSuccess<T> | ApiFailure;
  
  export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  }
  
  export interface EmpleadoEstadisticas {
    totalEmpleados: number;
    totalAdmins: number;
    totalEmpleadosRegulares: number;
  }