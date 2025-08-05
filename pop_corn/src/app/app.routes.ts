import { Routes } from '@angular/router';
import { MovieListComponent } from './movies/movie-list/movie-list.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { BookingComponent } from './booking/booking.component';
import { BomboniereComponent } from './bomboniere/bomboniere/bomboniere.component';
import { PaymentComponent } from './payment/payment/payment.component';
import { OrderHistoryComponent } from './order/order-history/order-history.component';

// guards e os componentes de autenticação
import { authGuard, adminGuard, masterGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { ProfileComponent } from './auth/profile/profile.component';

// componentes de admin
import { MovieManagementComponent } from './admin/movie-management.component/movie-management.component';
import { SessionManagementComponent } from './admin/session-management.component/session-management.component';

import { CinemaManagementComponent } from './admin/cinema-management.component/cinema-management.component';

export const routes: Routes = [
    // --- Rotas Públicas ---
    { path: 'login', component: LoginComponent },
    { path: '', component: MovieListComponent },
    { path: 'movie/:id', component: MovieDetailsComponent },

    // --- Rotas de Utilizador Logado (protegidas pelo authGuard) ---
    { path: 'booking/:sessionId', component: BookingComponent, canActivate: [authGuard] },
    { path: 'bomboniere', component: BomboniereComponent, canActivate: [authGuard] },
    { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
    { path: 'meus-pedidos', component: OrderHistoryComponent, canActivate: [authGuard] },
    { path: 'perfil', component: ProfileComponent, canActivate: [authGuard] },

    // Rotas de Admin (acessível por ADMIN e MASTER)
    {
        path: 'admin/gerir-filmes',
        component: MovieManagementComponent,
        canActivate: [authGuard, adminGuard]
    },
    {
        path: 'admin/gerir-sessoes',
        component: SessionManagementComponent,
        canActivate: [authGuard, adminGuard]
    },
    
    // --- Rotas de Master (acessível APENAS por MASTER) ---
    {
        path: 'master/gerir-cinemas', // Nova rota
        component: CinemaManagementComponent,
        canActivate: [authGuard, masterGuard]
    },
    // // --- Rotas de Master (acessível APENAS por MASTER) ---
    // {
    //     path: 'master/dashboard-negocios',
    //     // loadComponent: () => import('./master/dashboard/dashboard.component').then(c => c.DashboardComponent),
    //     canActivate: [authGuard, masterGuard]
    // },
    // {
    //     path: 'master/gerir-admins',
    //     // loadComponent: () => import('./master/user-management/user-management.component').then(c => c.UserManagementComponent),
    //     canActivate: [authGuard, masterGuard]
    // },

    // --- Rota de Fallback ---
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
