// src/app/auth/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { AbstractAuthService } from './abstract-auth.service';
import { environment } from '../../../environment/environment';

@Injectable()
export class AuthService implements AbstractAuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN' || this.currentUser()?.role === 'MASTER');
  isMaster = computed(() => this.currentUser()?.role === 'MASTER');

  constructor(private http: HttpClient, private router: Router) {
    const userJson = localStorage.getItem('popcorn_user');
    if (userJson) {
      this.currentUser.set(JSON.parse(userJson));
    }
  }

  login(email: string, password: string) {
    this.http.post<User>(`${this.apiUrl}/login`, { email, password }).subscribe(user => {
      localStorage.setItem('popcorn_user', JSON.stringify(user));
      this.currentUser.set(user);
      this.router.navigate(['/']);
    });
  }

  logout() {
    localStorage.removeItem('popcorn_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
