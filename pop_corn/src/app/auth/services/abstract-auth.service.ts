import { User } from '../models/user.model';
import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationResult } from '../../models/operation-result.model';

export abstract class AbstractAuthService {
  abstract currentUser: Signal<User | null>;
  abstract isAuthenticated: Signal<boolean>;
  abstract isAdmin: Signal<boolean>;
  abstract isMaster: Signal<boolean>;

  abstract allUsers: Signal<User[]>;
  abstract updateUser(user: User): Observable<OperationResult>;
  abstract addUser(userData: Omit<User, 'id'>): Observable<OperationResult<User>>;
  
  abstract login(email: string, password: string): void;
  abstract logout(): void;
}