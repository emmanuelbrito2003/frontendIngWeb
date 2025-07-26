import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-container">
      <!-- Navbar - solo mostrar si está autenticado y no está en login -->
      <app-navbar *ngIf="showNavbar"></app-navbar>
      
      <!-- Contenido principal -->
      <main [class.with-navbar]="showNavbar">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    main.with-navbar {
      margin-top: 0;
    }

    /* Asegurar que el contenido ocupe toda la pantalla cuando no hay navbar */
    main:not(.with-navbar) {
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Sistema de Empleados';
  showNavbar = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Escuchar cambios en el estado de autenticación
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.updateNavbarVisibility();
    });

    // Escuchar cambios de ruta
    this.router.events.subscribe(() => {
      this.updateNavbarVisibility();
    });
  }

  private updateNavbarVisibility(): void {
    const currentUrl = this.router.url;
    const isAuthenticated = this.authService.isAuthenticated();
    
    // Mostrar navbar si está autenticado y no está en la página de login
    this.showNavbar = isAuthenticated && !currentUrl.includes('/login');
  }
}