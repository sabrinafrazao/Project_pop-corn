// src/app/core/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AbstractAuthService } from '../auth/services/abstract-auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injeta o serviço de autenticação para pegar o token
  const authService = inject(AbstractAuthService);
  const token = authService.getToken();

  // Se não houver token, ou se a requisição for para o login/registro,
  // não faz nada e apenas passa a requisição adiante.
  if (!token || req.url.includes('/auth/token') || (req.url.includes('/users') && req.method === 'POST')) {
    return next(req);
  }

  // Se um token existir, clona a requisição e adiciona o cabeçalho de autorização
  const clonedRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  // Envia a requisição clonada com o token
  return next(clonedRequest);
};
