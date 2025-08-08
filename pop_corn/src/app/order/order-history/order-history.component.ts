import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AbstractOrderService } from '../services/abstract-order.service';
import { AbstractAuthService } from '../../auth/services/abstract-auth.service';
import { AbstractCinemaService } from '../../cinemas/service/abstract-cinema.service';
import { FinalizedOrder } from '../models/finalized-order.model';
import { Order as TicketOrder } from '../../booking/models/ticket.model';
import { BomboniereOrder } from '../../bomboniere/models/bomboniere.model';
import { Seat } from '../../cinemas/models/seat.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent {
  orderService = inject(AbstractOrderService);
  authService = inject(AbstractAuthService);
  cinemaService = inject(AbstractCinemaService);
  router = inject(Router);

  filterByCinemaId = signal<string>('all');
  filterByMovieTitle = signal<string>('all');

  allOrders = this.orderService.completedOrders;
  allCinemas = this.cinemaService.cinemas;
  currentUser = this.authService.currentUser;

  // --- PROPRIEDADE RE-ADICIONADA ---
  movieTitlesInOrders = computed(() => {
    const adminCinemaId = this.currentUser()?.cinemaId;
    if (!this.authService.isAdmin() || this.authService.isMaster()) return [];
    
    const titles = this.allOrders()
      .filter(o => o.cinema_id === adminCinemaId)
      .map(o => o.movieTitle);
    return [...new Set(titles)];
  });
  // ---------------------------------

  displayedOrders = computed(() => {
    const user = this.currentUser();
    if (!user) return [];

    let orders = this.allOrders();
    const cinemaFilter = this.filterByCinemaId();

    if (this.authService.isMaster()) {
      if (cinemaFilter !== 'all') {
        const numericCinemaId = +cinemaFilter;
        orders = orders.filter(o => o.cinema_id === numericCinemaId);
      }
    } else if (this.authService.isAdmin()) {
      orders = orders.filter(o => o.cinema_id === user.cinemaId);
      if (this.filterByMovieTitle() !== 'all') {
        orders = orders.filter(o => o.movieTitle === this.filterByMovieTitle());
      }
    } else {
      orders = orders.filter(o => o.user_id === user.id);
    }
    
    return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  });
  
  expandedOrderId = signal<string | null>(null);

  constructor() {
    if (this.allCinemas().length === 0) {
      this.cinemaService.loadSessionsByMovie(1); 
    }
  }

  toggleOrderDetails(orderId: string): void {
    this.expandedOrderId.update(currentId => (currentId === orderId ? null : orderId));
  }

  getTicketCount(tickets: TicketOrder[]): number {
    return tickets.reduce((acc, item) => acc + item.quantity, 0);
  }

  getBomboniereCount(items: BomboniereOrder[]): number {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }

  getSeatsText(seats: Seat[]): string {
    return seats.map(s => s.id).join(', ');
  }

  cancelOrder(orderId: string): void {
    this.orderService.cancelOrder(orderId);
  }
}
