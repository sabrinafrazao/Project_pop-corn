// src/app/layout/sidebar/sidebar.component.ts
import { Component, signal, HostBinding, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// 1. Importe a classe abstrata
import { AbstractAuthService } from '../../auth/services/abstract-auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  // 2. Injete a classe abstrata
  authService = inject(AbstractAuthService);
  isCollapsed = signal(false);

  @HostBinding('class.collapsed') get collapsed() {
    return this.isCollapsed();
  }

  toggleSidebar(): void {
    this.isCollapsed.update(collapsed => !collapsed);
  }
}