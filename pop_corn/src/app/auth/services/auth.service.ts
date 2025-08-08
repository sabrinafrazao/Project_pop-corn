// src/app/auth/services/auth.service.ts

import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user.model';
import { AbstractAuthService } from './abstract-auth.service';
import { environment } from '../../../environment/environment';
import { Observable, tap, of, map, catchError, throwError } from 'rxjs';
import { OperationResult } from '../../models/operation-result.model';

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

@Injectable()
export class AuthService implements AbstractAuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID); // Inject PLATFORM_ID

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN' || this.currentUser()?.role === 'MASTER');
  isMaster = computed(() => this.currentUser()?.role === 'MASTER');
  allUsers = signal<User[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('popcorn_user');
      if (userJson) {
        this.currentUser.set(JSON.parse(userJson));
      }
    } else {
      this.currentUser.set(null);
    }
  }

  // --- MÉTODO ADICIONADO ---
  loadAllUsers(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<User[]>(`${this.apiUrl}/users`).subscribe(users => {
        this.allUsers.set(users);
      });
    }
  }
  // -------------------------

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('popcorn_token');
    }
    return null;
  }

  login(email: string, password: string): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    this.http.post<LoginResponse>(`${this.apiUrl}/auth/token`, body.toString(), { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage = error.error?.detail || 'Erro desconhecido no login.';
          alert(`Falha no login: ${errorMessage}`);
          console.error("Detalhes do erro de login:", error);
          return throwError(() => new Error(errorMessage));
        })
      )
      .subscribe({
        next: (response) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('popcorn_token', response.access_token);
            localStorage.setItem('popcorn_user', JSON.stringify(response.user));
          }
          this.currentUser.set(response.user);
          this.router.navigate(['/']);
        }
      });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('popcorn_token');
      localStorage.removeItem('popcorn_user');
    }
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  addUser(userData: Omit<User, 'id'>): Observable<OperationResult<User>> {
    const userToCreate = { ...userData, password: userData.password || '' };
    return this.http.post<User>(`${this.apiUrl}/users`, userToCreate).pipe(
      map(createdUser => {
        this.allUsers.update(users => [...users, createdUser]);
        return { success: true, data: createdUser };
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.detail || 'Não foi possível criar o usuário.';
        alert(`Falha no cadastro: ${errorMessage}`);
        console.error("Detalhes do erro de cadastro:", error);
        return of({ success: false, data: error });
      })
    );
  }

  forgotPassword(email: string): Observable<OperationResult> {
    console.log(`[FRONTEND] Pedido de recuperação de senha para o email: ${email}`);
    return of({ success: true });
  }

  updateUser(user: User): Observable<OperationResult> {
    return this.http.put<OperationResult>(`${this.apiUrl}/users/${user.id}`, user).pipe(
      tap(() => {
        if (this.currentUser()?.id === user.id) {
          this.currentUser.set(user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('popcorn_user', JSON.stringify(user));
          }
        }
        this.allUsers.update(users => users.map(u => u.id === user.id ? user : u));
      })
    );
  }
}
