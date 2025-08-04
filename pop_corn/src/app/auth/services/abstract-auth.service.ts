import { User } from '../models/user.model';
import { Signal } from '@angular/core';

export abstract class AbstractAuthService {
  abstract currentUser: Signal<User | null>;
  abstract isAuthenticated: Signal<boolean>;
  abstract isAdmin: Signal<boolean>;
  abstract isMaster: Signal<boolean>;

  abstract login(email: string, password: string): void;
  abstract logout(): void;
}
