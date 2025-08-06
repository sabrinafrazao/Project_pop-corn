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

  // Sinais para os filtros
  filterByCinemaId = signal<string>('all');
  filterByMovieTitle = signal<string>('all');

  // Obtém todos os dados necessários
  allOrders = this.orderService.completedOrders;
  allCinemas = this.cinemaService.cinemas;
  currentUser = this.authService.currentUser;

  // Sinal computado que decide quais pedidos mostrar com base na role e nos filtros
  displayedOrders = computed(() => {
    const user = this.currentUser();
    if (!user) return [];

    let orders = this.allOrders();

    // Filtra por role
    if (this.authService.isMaster()) {
      if (this.filterByCinemaId() !== 'all') {
        orders = orders.filter(o => o.cinemaId === +this.filterByCinemaId());
      }
    } else if (this.authService.isAdmin()) {
      orders = orders.filter(o => o.cinemaId === user.cinemaId);
      if (this.filterByMovieTitle() !== 'all') {
        orders = orders.filter(o => o.movieTitle === this.filterByMovieTitle());
      }
    } else {
      orders = orders.filter(o => o.userId === user.id);
    }

    // Ordena do mais recente para o mais antigo
    return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  });

  // Extrai uma lista única de filmes dos pedidos para o filtro do admin
  movieTitlesInOrders = computed(() => {
    const adminCinemaId = this.currentUser()?.cinemaId;
    const titles = this.allOrders()
      .filter(o => o.cinemaId === adminCinemaId)
      .map(o => o.movieTitle);
    return [...new Set(titles)];
  });
  
  expandedOrderId = signal<string | null>(null);

  toggleOrderDetails(orderId: string): void {
    this.expandedOrderId.update(currentId => (currentId === orderId ? null : orderId));
  }

  getTicketCount(tickets: TicketOrder[]): number {
    return tickets.reduce((acc, item) => acc + item.quantity, 0);
  }

  getBomboniereCount(items: BomboniereOrder[]): number {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }

  // NOVO: Método para formatar os lugares
  getSeatsText(seats: Seat[]): string {
    return seats.map(s => s.id).join(', ');
  }

  cancelOrder(orderId: string): void {
    this.orderService.cancelOrder(orderId);
  }
}
