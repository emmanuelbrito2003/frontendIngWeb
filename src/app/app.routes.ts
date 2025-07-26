import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EmpleadoProfileComponent } from './components/empleado-profile/empleado-profile.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { empleadoGuard } from './guards/empleado.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'profile', 
    component: EmpleadoProfileComponent,
    canActivate: [empleadoGuard]
  },
  { path: '**', redirectTo: '/login' }
];