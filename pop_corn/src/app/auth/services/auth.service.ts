import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { AbstractAuthService } from './abstract-auth.service';
import { environment } from '../../../environment/environment';
import { Observable, of, tap } from 'rxjs';
import { OperationResult } from '../../models/operation-result.model';

@Injectable()
export class AuthService implements AbstractAuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN' || this.currentUser()?.role === 'MASTER');
  isMaster = computed(() => this.currentUser()?.role === 'MASTER');

  // ===== IMPLEMENTAÇÕES QUE FALTAVAM =====
  allUsers = signal<User[]>([]);

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

  addUser(userData: Omit<User, 'id'>): Observable<OperationResult<User>> {
    // Lógica real: fazer uma chamada POST para a API
    return this.http.post<OperationResult<User>>(`${environment.apiUrl}/users`, userData);
  }
  // =======================================

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