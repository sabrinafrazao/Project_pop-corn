import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AbstractOrderService } from '../services/abstract-order.service';
import { Order as TicketOrder } from '../../booking/models/ticket.model';
import { BomboniereOrder } from '../../bomboniere/models/bomboniere.model';
import { Seat } from '../../cinemas/models/seat.model'; // Importar Seat

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent {
  orderService = inject(AbstractOrderService);
  router = inject(Router);

  myOrders = this.orderService.completedOrders;
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
