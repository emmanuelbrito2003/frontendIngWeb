import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserInfo } from '../../models/auth.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div class="container-fluid">
        <!-- Brand -->
        <a class="navbar-brand" href="#">
          <i class="bi bi-building"></i>
          Sistema de Empleados
        </a>

        <!-- Mobile toggle button -->
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar content -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- Navigation links -->
          <ul class="navbar-nav me-auto" *ngIf="currentUser">
            <li class="nav-item" *ngIf="currentUser.rol === 'ADMIN'">
              <a 
                class="nav-link" 
                routerLink="/admin" 
                routerLinkActive="active">
                <i class="bi bi-speedometer2"></i>
                Dashboard
              </a>
            </li>
            <li class="nav-item" *ngIf="currentUser.rol === 'EMPLEADO'">
              <a 
                class="nav-link" 
                routerLink="/profile" 
                routerLinkActive="active">
                <i class="bi bi-person"></i>
                Mi Perfil
              </a>
            </li>
          </ul>

          <!-- User info and logout -->
          <ul class="navbar-nav" *ngIf="currentUser">
            <li class="nav-item">
              <span class="nav-link d-flex align-items-center">
                <i class="bi bi-person-circle me-2"></i>
                {{ currentUser.nombre }}
                <span class="badge ms-2" 
                      [ngClass]="currentUser.rol === 'ADMIN' ? 'badge-admin' : 'badge-empleado'">
                  {{ currentUser.rol }}
                </span>
              </span>
            </li>
            <li class="nav-item">
              <button 
                class="btn btn-outline-light btn-sm d-flex align-items-center" 
                (click)="logout($event)">
                <i class="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-weight: 600;
      font-size: 1.5rem;
    }
    
    .nav-link {
      font-weight: 500;
      transition: color 0.2s ease-in-out;
    }
    
    .nav-link:hover {
      color: #fff !important;
    }
    
    .nav-link.active {
      color: #fff !important;
      font-weight: 600;
    }
    
    .dropdown-item-text {
      font-size: 0.875rem;
      padding: 0.25rem 1rem;
      color: #6c757d;
    }
    
    .dropdown-item-text strong {
      color: #495057;
    }
    
    .badge-admin {
      background-color: #6f42c1;
    }
    
    .badge-empleado {
      background-color: #20c997;
    }
    
    .dropdown-menu {
      min-width: 250px;
    }
    
    .bi {
      margin-right: 0.5rem;
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: UserInfo | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Suscribirse a cambios en el usuario actual
    this.subscriptions.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout(event: Event): void {
    event.preventDefault();
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      this.authService.logout();
    }
  }
}