// src/app/order/services/abstract-order.service.ts
import { Signal } from '@angular/core';
import { Seat } from '../../cinemas/models/seat.model';
import { Order as TicketOrder } from '../../booking/models/ticket.model';
import { BomboniereOrder, BomboniereProduct } from '../../bomboniere/models/bomboniere.model';
import { FinalizedOrder } from '../models/finalized-order.model';
import { Movie } from '../../movies/models/movies.model';
import { Session } from '../../cinemas/models/session.model';

export abstract class AbstractOrderService {
  // Estado do Pedido Ativo
  abstract activeOrderContext: Signal<{ movie: Movie; session: Session; cinemaName: string; } | null>;
  abstract selectedSeats: Signal<Seat[]>;
  abstract ticketOrder: Signal<TicketOrder[]>;
  abstract bomboniereOrder: Signal<BomboniereOrder[]>;
  abstract totalPrice: Signal<number>;

  // Pedidos Finalizados
  abstract completedOrders: Signal<FinalizedOrder[]>;

  // Métodos
  abstract setOrderContext(movie: Movie, session: Session, cinemaName: string): void;
  abstract setTickets(seats: Seat[], tickets: TicketOrder[]): void;
  abstract updateBomboniereOrder(productId: number, quantity: number, product: BomboniereProduct): void;
  abstract finalizeOrder(cpf: string): FinalizedOrder;
  abstract cancelOrder(orderId: string): void;
}
