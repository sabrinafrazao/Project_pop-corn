import { Component, signal, HostBinding, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AbstractAuthService } from '../../auth/services/abstract-auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  authService = inject(AbstractAuthService);
  
  // ===== 1. RECEBE O ESTADO INICIAL COMO INPUT =====
  @Input() startCollapsed: boolean = false;

  // O sinal agora usa o 'startCollapsed' como valor inicial
  isCollapsed = signal(this.startCollapsed);

  @HostBinding('class.collapsed') get collapsed() {
    return this.isCollapsed();
  }

  // ===== 2. APLICA O ESTADO INICIAL QUANDO O COMPONENTE É CRIADO =====
  ngOnInit(): void {
    this.isCollapsed.set(this.startCollapsed);
  }

  toggleSidebar(): void {
    this.isCollapsed.update(collapsed => !collapsed);
  }
}