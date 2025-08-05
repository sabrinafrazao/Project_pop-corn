import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AbstractAuthService } from './abstract-auth.service';

// ===== 1. CONSTANTES DOS USUÁRIOS DE TESTE =====
// Defina os três perfis de usuário aqui.

const DEV_USER: User = {
  id: '101',
  name: 'Usuário Padrão',
  email: 'user@test.com',
  role: 'USER',
  avatarUrl: 'https://placehold.co/100x100/FFFFFF/000000?text=U'
  // Sem cinemaId para um usuário comum
};

const DEV_ADMIN: User = {
  id: '998',
  name: 'Dev Admin',
  email: 'admin@dev.com',
  role: 'ADMIN',
  avatarUrl: 'https://placehold.co/100x100/4A5568/FFFFFF?text=A',
  cinemaId: 1 // Gerencia o cinema "Centerplex"
};

const DEV_MASTER: User = {
  id: '999',
  name: 'Dev Master',
  email: 'master@dev.com',
  role: 'MASTER',
  avatarUrl: 'https://placehold.co/100x100/FFC800/000000?text=M',
  cinemaId: 2 // Gerencia o cinema "Cinépolis"
};


@Injectable()
export class MockAuthService implements AbstractAuthService {
  private platformId = inject(PLATFORM_ID);

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN' || this.currentUser()?.role === 'MASTER');
  isMaster = computed(() => this.currentUser()?.role === 'MASTER');

  constructor(private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('popcorn_user');
      if (userJson) {
        this.currentUser.set(JSON.parse(userJson));
      } else {
        
        // ===== 2. PONTO DE TROCA =====
        // Para alternar o usuário padrão, simplesmente troque a constante abaixo.
        // Opções: DEV_USER, DEV_ADMIN, DEV_MASTER
        const defaultUser = DEV_MASTER;
        // ==============================

        localStorage.setItem('popcorn_user', JSON.stringify(defaultUser));
        this.currentUser.set(defaultUser);
      }
    }
  }

  login(email: string, password: string) {
    let userToLogin: User;
    if (email.startsWith('admin@')) {
      userToLogin = DEV_ADMIN;
    } else if (email.startsWith('master@')) {
      userToLogin = DEV_MASTER;
    } else {
      userToLogin = DEV_USER;
    }

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('popcorn_user', JSON.stringify(userToLogin));
    }
    this.currentUser.set(userToLogin);
    this.router.navigate(['/']);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('popcorn_user');
    }
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}