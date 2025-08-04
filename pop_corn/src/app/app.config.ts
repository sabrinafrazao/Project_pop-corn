import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { MovieProvider } from './movies/service/movie.provider.service';
import { CinemaProvider } from './cinemas/service/cinema.provider.service';
import { AuthProvider } from './auth/services/auth.provider.service';
import { OrderProvider } from './order/services/order.provider.service';
import { BomboniereProvider } from './bomboniere/services/bomboniere.provider.service.ts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    MovieProvider,
    CinemaProvider,
    AuthProvider,
    OrderProvider,
    BomboniereProvider
  ]
};