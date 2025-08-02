import { Routes } from '@angular/router';
import { MovieListComponent } from './movies/movie-list/movie-list.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { BookingComponent } from './booking/booking.component';
import { BomboniereComponent } from './bomboniere/bomboniere/bomboniere.component';
import { PaymentComponent } from './payment/payment/payment.component';
import { OrderHistoryComponent } from './order/order-history/order-history.component';

export const routes: Routes = [
    { path: '', component: MovieListComponent },
    { path: 'movie/:id', component: MovieDetailsComponent },
    { path: 'booking/:sessionId', component: BookingComponent },
    { path: 'bomboniere', component: BomboniereComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'meus-pedidos', component: OrderHistoryComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];