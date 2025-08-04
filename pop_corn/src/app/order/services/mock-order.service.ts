// src/app/order/services/mock-order.service.ts
import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AbstractOrderService } from './abstract-order.service';
import { FinalizedOrder } from '../models/finalized-order.model';
import { Movie } from '../../movies/models/movies.model';
import { Session } from '../../cinemas/models/session.model';
import { Seat } from '../../cinemas/models/seat.model';
import { Order as TicketOrder } from '../../booking/models/ticket.model';
import { BomboniereOrder, BomboniereProduct } from '../../bomboniere/models/bomboniere.model';

@Injectable()
export class MockOrderService implements AbstractOrderService {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'popCornOrders';

  // Estado do Pedido Ativo
  activeOrderContext = signal<{ movie: Movie; session: Session; cinemaName: string; } | null>(null);
  selectedSeats = signal<Seat[]>([]);
  ticketOrder = signal<TicketOrder[]>([]);
  bomboniereOrder = signal<BomboniereOrder[]>([]);

  // Pedidos Finalizados
  completedOrders = signal<FinalizedOrder[]>([]);

  // Sinais Computados
  totalTicketPrice = computed(() => this.ticketOrder().reduce((acc, item) => acc + (item.quantity * item.ticketType.price), 0));
  totalBombonierePrice = computed(() => this.bomboniereOrder().reduce((acc, item) => acc + (item.quantity * item.product.price), 0));
  totalPrice = computed(() => this.totalTicketPrice() + this.totalBombonierePrice());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.completedOrders.set(this.loadOrdersFromStorage());
      effect(() => this.saveOrdersToStorage(this.completedOrders()));
    }
  }
  
  setOrderContext(movie: Movie, session: Session, cinemaName: string): void {
    this.activeOrderContext.set({ movie, session, cinemaName });
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

  finalizeOrder(cpf: string): FinalizedOrder {
    const context = this.activeOrderContext();
    if (!context) {
      throw new Error("Contexto do pedido ativo não encontrado para finalização.");
    }

    const newFinalizedOrder: FinalizedOrder = {
      orderId: `PC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      orderDate: new Date(),
      status: 'Aguardando Pagamento',
      cpf,
      totalPrice: this.totalPrice(),
      // Detalhes do pedido
      movieTitle: context.movie.title,
      movieImage: context.movie.image,
      cinemaName: context.cinemaName,
      sessionTime: context.session.time,
      selectedSeats: this.selectedSeats(),
      ticketOrder: this.ticketOrder(),
      bomboniereOrder: this.bomboniereOrder(),
      // Detalhes do PIX
      pixQrCode: 'assets/images/fake-qr-code.png',
      pixCopyPaste: Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
    };

    this.completedOrders.update(orders => [...orders, newFinalizedOrder]);
    this.resetActiveOrder();
    return newFinalizedOrder;
  }

  cancelOrder(orderId: string): void {
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

  private saveOrdersToStorage(orders: FinalizedOrder[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    }
  }

  private loadOrdersFromStorage(): FinalizedOrder[] {
    if (isPlatformBrowser(this.platformId)) {
      const savedOrders = localStorage.getItem(this.STORAGE_KEY);
      return savedOrders ? JSON.parse(savedOrders) : [];
    }
    return [];
  }
}
