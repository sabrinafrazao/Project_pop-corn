import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = 'pop_corn';
  router = inject(Router);
  
  // Sinal para controlar se a sidebar deve começar recolhida
  isSidebarCollapsed = signal(false);

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Lista de rotas onde a sidebar deve começar RECOLHIDA
      const collapsedRoutes = ['/login', '/register', '/forgot-password'];
      
      // Verifica se a URL atual está na lista e atualiza o sinal
      if (collapsedRoutes.includes(event.urlAfterRedirects)) {
        this.isSidebarCollapsed.set(true);
      } else {
        this.isSidebarCollapsed.set(false);
      }
    });
  }
}