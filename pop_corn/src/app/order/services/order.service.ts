// src/app/order/services/order.service.ts
import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map, catchError } from 'rxjs';

import { AbstractOrderService } from './abstract-order.service';
import { FinalizedOrder } from '../models/finalized-order.model';
import { Movie } from '../../movies/models/movies.model';
import { Session } from '../../cinemas/models/session.model';
import { Seat } from '../../cinemas/models/seat.model';
import { Order as TicketOrder } from '../../booking/models/ticket.model';
import { BomboniereOrder, BomboniereProduct } from '../../bomboniere/models/bomboniere.model';
import { environment } from '../../../environment/environment';
import { OperationResult } from '../../models/operation-result.model';
import { AbstractAuthService } from '../../auth/services/abstract-auth.service'; // 1. Importar AuthService

@Injectable()
export class OrderService extends AbstractOrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AbstractAuthService); // 2. Injetar AuthService

  activeOrderContext = signal<{ movie: Movie; session: Session; cinemaName: string; cinemaId: number; } | null>(null);
  selectedSeats = signal<Seat[]>([]);
  ticketOrder = signal<TicketOrder[]>([]);
  bomboniereOrder = signal<BomboniereOrder[]>([]);
  completedOrders = signal<FinalizedOrder[]>([]);

  totalTicketPrice = computed(() => this.ticketOrder().reduce((acc, item) => acc + (item.quantity * item.ticketType.price), 0));
  totalBombonierePrice = computed(() => this.bomboniereOrder().reduce((acc, item) => acc + (item.quantity * item.product.price), 0));
  totalPrice = computed(() => this.totalTicketPrice() + this.totalBombonierePrice());

  constructor() {
    super();
    if (isPlatformBrowser(this.platformId)) {
      this.loadOrderHistory();
    }
  }

  private loadOrderHistory(): void {
    // Agora que temos utilizadores, podemos implementar isto
    this.http.get<FinalizedOrder[]>(`${this.apiUrl}/my-history`).subscribe(orders => {
      this.completedOrders.set(orders);
    });
  }

  setOrderContext(movie: Movie, session: Session, cinemaName: string, cinemaId: number): void {
    this.activeOrderContext.set({ movie, session, cinemaName, cinemaId });
  }

  setTickets(seats: Seat[], tickets: TicketOrder[]): void {
    this.selectedSeats.set(seats);
    this.ticketOrder.set(tickets);
  }

  updateBomboniereOrder(productId: number, quantity: number, product: BomboniereProduct): void {
    this.bomboniereOrder.update(currentOrder => {
      const existingItemIndex = currentOrder.findIndex(item => item.product.id === productId);
      if (quantity > 0) {
        if (existingItemIndex > -1) {
          currentOrder[existingItemIndex].quantity = quantity;
        } else {
          currentOrder.push({ product, quantity });
        }
      } else if (existingItemIndex > -1) {
        currentOrder.splice(existingItemIndex, 1);
      }
      return [...currentOrder];
    });
  }

  // --- MÉTODO COMPLETAMENTE ATUALIZADO ---
  finalizeOrder(cpf: string): Observable<OperationResult<FinalizedOrder>> {
    const context = this.activeOrderContext();
    const currentUser = this.authService.currentUser();

    if (!context || !currentUser) {
      const errorMsg = "Contexto do pedido ou usuário não encontrado para finalização.";
      console.error(errorMsg);
      return of({ success: false, data: errorMsg });
    }

    const orderPayload = {
      cpf: cpf,
      totalPrice: this.totalPrice(),
      movieTitle: context.movie.title,
      movieImage: context.movie.image,
      cinemaName: context.cinemaName,
      sessionTime: context.session.time,
      selectedSeats: this.selectedSeats(),
      ticketOrder: this.ticketOrder(),
      bomboniereOrder: this.bomboniereOrder(),
      cinema_id: context.cinemaId,
      session_id: context.session.id
    };

    return this.http.post<FinalizedOrder>(this.apiUrl, orderPayload).pipe(
      tap(finalizedOrder => {
        this.completedOrders.update(orders => [...orders, finalizedOrder]);
        this.resetActiveOrder();
      }),
      map(finalizedOrder => ({ success: true, data: finalizedOrder })),
      catchError(err => {
        console.error("Erro ao finalizar o pedido:", err);
        return of({ success: false, data: err });
      })
    );
  }

  cancelOrder(orderId: string): void {
    console.log(`[SERVICE] A cancelar pedido ${orderId}`);
    this.completedOrders.update(orders =>
      orders.map(order =>
        order.orderId === orderId ? { ...order, status: 'Cancelado' } : order
      )
    );
  }

  private resetActiveOrder() {
    this.activeOrderContext.set(null);
    this.selectedSeats.set([]);
    this.ticketOrder.set([]);
    this.bomboniereOrder.set([]);
  }
}
