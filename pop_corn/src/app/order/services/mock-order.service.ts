import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AbstractOrderService } from './abstract-order.service';
import { FinalizedOrder } from '../models/finalized-order.model';
import { Movie } from '../../movies/models/movies.model';
import { Session } from '../../cinemas/models/session.model';
import { Seat } from '../../cinemas/models/seat.model';
import { Order as TicketOrder } from '../../booking/models/ticket.model';
import { BomboniereOrder, BomboniereProduct } from '../../bomboniere/models/bomboniere.model';
import { AbstractAuthService } from '../../auth/services/abstract-auth.service';
import { Observable, of } from 'rxjs'; // Importar Observable e of
import { OperationResult } from '../../models/operation-result.model';

@Injectable()
export class MockOrderService extends AbstractOrderService {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AbstractAuthService);
  private readonly STORAGE_KEY = 'popCornOrders';

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
      this.completedOrders.set(this.loadOrdersFromStorage());
      effect(() => this.saveOrdersToStorage(this.completedOrders()));
    }
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

  // --- CORREÇÃO AQUI ---
  // O método agora retorna um Observable com o resultado da operação.
  finalizeOrder(cpf: string): Observable<OperationResult<FinalizedOrder>> {
    const context = this.activeOrderContext();
    const currentUser = this.authService.currentUser();

    if (!context || !currentUser) {
      const error = { success: false, data: "Contexto do pedido ou utilizador não encontrado." };
      return of(error as OperationResult<FinalizedOrder>);
    }

    const newFinalizedOrder: FinalizedOrder = {
      orderId: `PC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      orderDate: new Date(),
      status: 'Aguardando Pagamento',
      cpf,
      totalPrice: this.totalPrice(),
      userId: currentUser.id,
      cinemaId: context.cinemaId,
      movieTitle: context.movie.title,
      movieImage: context.movie.image,
      cinemaName: context.cinemaName,
      sessionTime: context.session.time,
      selectedSeats: this.selectedSeats(),
      ticketOrder: this.ticketOrder(),
      bomboniereOrder: this.bomboniereOrder(),
      pixQrCode: 'assets/images/fake-qr-code.png',
      pixCopyPaste: Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
    };

    this.completedOrders.update(orders => [...orders, newFinalizedOrder]);
    this.resetActiveOrder();
    return of({ success: true, data: newFinalizedOrder });
  }
  // ---------------------

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
