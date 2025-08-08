import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AbstractAuthService } from './abstract-auth.service';
import { of, Observable } from 'rxjs';
import { OperationResult } from '../../models/operation-result.model';

const DEV_USER: User = { id: '101', name: 'Usuário Padrão', email: 'user@test.com', role: 'USER', avatarUrl: 'https://placehold.co/100x100/FFFFFF/000000?text=U' };
const DEV_ADMIN: User = { id: '998', name: 'Dev Admin', email: 'admin@dev.com', role: 'ADMIN', avatarUrl: 'https://placehold.co/100x100/4A5568/FFFFFF?text=A', cinemaId: 1 };
const DEV_ADMIN_2: User = { id: '997', name: 'Admin Sem Cinema', email: 'admin2@dev.com', role: 'ADMIN', avatarUrl: 'https://placehold.co/100x100/4A5568/FFFFFF?text=A' };
const DEV_MASTER: User = { id: '999', name: 'Dev Master', email: 'master@dev.com', role: 'MASTER', avatarUrl: 'https://placehold.co/100x100/FFC800/000000?text=M', cinemaId: 2 };

const USERS_DB: User[] = [DEV_USER, DEV_ADMIN, DEV_ADMIN_2, DEV_MASTER];

@Injectable()
export class MockAuthService extends AbstractAuthService {
  private platformId = inject(PLATFORM_ID);
  
  private _users = signal<User[]>(USERS_DB);

  override currentUser = signal<User | null>(null);
  override allUsers = computed(() => this._users());
  override isAuthenticated = computed(() => !!this.currentUser());
  override isAdmin = computed(() => this.currentUser()?.role === 'ADMIN' || this.currentUser()?.role === 'MASTER');
  override isMaster = computed(() => this.currentUser()?.role === 'MASTER');

  constructor(private router: Router) {
    super();
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('popcorn_user');
      if (userJson) {
        this.currentUser.set(JSON.parse(userJson));
      } else {
        const defaultUser = DEV_MASTER;
        localStorage.setItem('popcorn_user', JSON.stringify(defaultUser));
        this.currentUser.set(defaultUser);
      }
    } else {
      // ADICIONADO: Define explicitamente o usuário como nulo no servidor
      this.currentUser.set(null);
    }
  }

  override addUser(userData: Omit<User, 'id'>): Observable<OperationResult<User>> {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`
    };
    this._users.update(users => [...users, newUser]);
    console.log("Novo utilizador adicionado:", newUser);
    return of({ success: true, data: newUser });
  }
  
  override updateUser(updatedUser: User): Observable<OperationResult> {
    this._users.update(users => 
        users.map(user => user.id === updatedUser.id ? { ...user, ...updatedUser } : user)
    );
    
    if (this.currentUser()?.id === updatedUser.id) {
        const userWithPasswordRemoved = { ...updatedUser };
        delete userWithPasswordRemoved.password;
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('popcorn_user', JSON.stringify(userWithPasswordRemoved));
        }
        this.currentUser.set(userWithPasswordRemoved);
    }
    
    console.log("Base de dados de utilizadores atualizada:", this._users());
    return of({ success: true, data: updatedUser });
  }

  override login(email: string, password: string) {
    let userToLogin: User | undefined;
    if (email.startsWith('admin@')) {
      userToLogin = this._users().find(u => u.email === 'admin@dev.com');
    } else if (email.startsWith('master@')) {
      userToLogin = this._users().find(u => u.email === 'master@dev.com');
    } else {
      userToLogin = this._users().find(u => u.role === 'USER');
    }

    if (userToLogin) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('popcorn_user', JSON.stringify(userToLogin));
      }
      this.currentUser.set(userToLogin);
      this.router.navigate(['/']);
    }
  }

  override logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('popcorn_user');
    }
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
 
  override getToken(): string | null{
    if (isPlatformBrowser(this.platformId)) {
        return localStorage.getItem('popcorn_token');
    }
    return null;
  }

  override forgotPassword(email: string): Observable<OperationResult> {
    console.log(`[MOCK] Pedido de recuperação de senha para o email: ${email}`);
    return of({ success: true });
  }

  override loadAllUsers(): void {
    // No mock, não precisamos fazer nada, pois os utilizadores já estão na memória.
    console.log('[MOCK] loadAllUsers chamado.');
  }
}
