// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// 1. Importe a classe abstrata
import { AbstractAuthService } from './services/abstract-auth.service'; 

// Verifica se o utilizador está logado
export const authGuard: CanActivateFn = (route, state) => {
  // 2. Injete a classe abstrata
  const authService = inject(AbstractAuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  return router.parseUrl('/login');
};

// Verifica se o utilizador é ADMIN ou superior (MASTER)
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AbstractAuthService); // Corrigido
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }
  return router.parseUrl('/');
};

// Verifica se o utilizador é MASTER
export const masterGuard: CanActivateFn = (route, state) => {
  const authService = inject(AbstractAuthService); // Corrigido
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isMaster()) {
    return true;
  }
  return router.parseUrl('/');
};