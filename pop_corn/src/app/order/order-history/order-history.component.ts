// src/app/order-history/order-history.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { FinalizedOrder } from '../models/finalized-order.model';
import { Order as TicketOrder } from '../../booking/models/ticket.model';
import { BomboniereOrder } from '../../bomboniere/models/bomboniere.model';


@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent {
  orderService = inject(OrderService);
  router = inject(Router);

  myOrders = this.orderService.completedOrders;

  // NOVO: Métodos para calcular totais no template
  getTicketCount(tickets: TicketOrder[]): number {
    return tickets.reduce((acc, item) => acc + item.quantity, 0);
  }

  getBomboniereCount(items: BomboniereOrder[]): number {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }
}
