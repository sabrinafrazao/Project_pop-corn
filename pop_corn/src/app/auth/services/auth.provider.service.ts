import { Provider } from '@angular/core';
import { environment } from '../../../environment/environment';
import { AbstractAuthService } from './abstract-auth.service';
import { MockAuthService } from './mock-auth.service';
import { AuthService } from './auth.service';

export const AuthProvider: Provider = {
  provide: AbstractAuthService,
  useClass: environment.useMockService ? MockAuthService : AuthService
};
