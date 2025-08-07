
import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { AbstractAuthService } from './abstract-auth.service';
import { environment } from '../../../environment/environment';
import { Observable, tap } from 'rxjs';
import { OperationResult } from '../../models/operation-result.model';
import { of } from 'rxjs';

// O tipo de resposta que a sua API de login devolve
interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

@Injectable()
export class AuthService implements AbstractAuthService {
  private apiUrl = `${environment.apiUrl}/api`;
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN' || this.currentUser()?.role === 'MASTER');
  isMaster = computed(() => this.currentUser()?.role === 'MASTER');
  allUsers = signal<User[]>([]);

  constructor() {
    const userJson = localStorage.getItem('popcorn_user');
    if (userJson) {
      this.currentUser.set(JSON.parse(userJson));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('popcorn_token');
  }

  login(email: string, password: string): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new URLSearchParams();
    body.set('username', email); // A API espera 'username'
    body.set('password', password);

    this.http.post<LoginResponse>(`${this.apiUrl}/auth/token`, body.toString(), { headers })
      .subscribe(response => {
        // Guarda o token e os dados do utilizador
        localStorage.setItem('popcorn_token', response.access_token);
        localStorage.setItem('popcorn_user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
        this.router.navigate(['/']);
      });
  }

  logout(): void {
    localStorage.removeItem('popcorn_token');
    localStorage.removeItem('popcorn_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  addUser(userData: Omit<User, 'id'>): Observable<OperationResult<User>> {
    return this.http.post<OperationResult<User>>(`${this.apiUrl}/users`, userData);
  }

  forgotPassword(email: string): Observable<OperationResult> {
    // Numa aplicação real, faria uma chamada POST para a sua API
    console.log(`[REAL] A enviar pedido de recuperação para a API para o email: ${email}`);
    // return this.http.post<OperationResult>(`${this.apiUrl}/forgot-password`, { email });
    return of({ success: true }); // Simula o sucesso por agora
  }

    updateUser(user: User): Observable<OperationResult> {
    // Lógica real: fazer uma chamada PUT para a API
    return this.http.put<OperationResult>(`${environment.apiUrl}/users/${user.id}`, user).pipe(
      tap(() => {
        // Atualiza o utilizador atual se for o que foi editado
        if (this.currentUser()?.id === user.id) {
          this.currentUser.set(user);
        }
      })
    );
  }
}