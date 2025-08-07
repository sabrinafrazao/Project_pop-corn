
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AbstractAuthService } from '../auth/services/abstract-auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AbstractAuthService);
  const token = authService.getToken(); // Precisaremos de adicionar este método ao serviço

  // Se o token existir, clona o pedido e adiciona o cabeçalho de autorização
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  // Se não houver token, envia o pedido original
  return next(req);
};
