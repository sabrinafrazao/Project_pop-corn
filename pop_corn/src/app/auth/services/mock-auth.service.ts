import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AbstractAuthService } from './abstract-auth.service';

@Injectable()
export class MockAuthService implements AbstractAuthService {
  private platformId = inject(PLATFORM_ID);

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN' || this.currentUser()?.role === 'MASTER');
  isMaster = computed(() => this.currentUser()?.role === 'MASTER');

  constructor(private router: Router) {
    // Simula persistência e um utilizador de desenvolvimento
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('popcorn_user');
      if (userJson) {
        this.currentUser.set(JSON.parse(userJson));
      } else {
        // Utilizador 'master' por defeito para facilitar o desenvolvimento
        const devUser: User = {
          id: '999',
          name: 'Dev Master',
          email: 'master@dev.com',
          role: 'MASTER',
          avatarUrl: 'https://placehold.co/100x100/FFC800/000000?text=M'
        };
        localStorage.setItem('popcorn_user', JSON.stringify(devUser));
        this.currentUser.set(devUser);
      }
    }
  }

  login(email: string, password: string) {
    let role: User['role'] = 'USER';
    let avatarUrl = 'https://placehold.co/100x100/FFFFFF/000000?text=U';
    let name = 'Utilizador';
    let cinemaId: number | undefined = undefined;

    if (email.startsWith('admin@')) {
      role = 'ADMIN';
      avatarUrl = 'https://placehold.co/100x100/4A5568/FFFFFF?text=A';
      name = 'Admin Cinema 1';
      cinemaId = 1; // Este admin gere o cinema com ID 1
    }
    if (email.startsWith('master@')) {
      role = 'MASTER';
      avatarUrl = 'https://placehold.co/100x100/FFC800/000000?text=M';
      name = 'Master';
    }

    const fakeUser: User = { id: '1', name, email, role, avatarUrl, cinemaId };

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('popcorn_user', JSON.stringify(fakeUser));
    }

    this.currentUser.set(fakeUser);
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
