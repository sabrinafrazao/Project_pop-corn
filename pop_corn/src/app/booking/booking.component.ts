import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

import { Session } from '../cinemas/models/session.model';
import { Seat } from '../cinemas/models/seat.model'; // Importa o modelo Seat
import { AbstractCinemaService } from '../cinemas/service/abstract-cinema.service';
import { Order, TicketType } from './models/ticket.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  session: Signal<Session | undefined>;
  ticketTypes: TicketType[] = [
    { id: 'inteira', name: 'Inteira', price: 30.00 },
    { id: 'meia', name: 'Meia-entrada', price: 15.00 }
  ];

  order: WritableSignal<Order[]> = signal([]);
  selectedSeats = signal<Seat[]>([]);
  totalTickets = computed(() => this.order().reduce((acc, item) => acc + item.quantity, 0));
  totalPrice = computed(() => this.order().reduce((acc, item) => acc + (item.quantity * item.ticketType.price), 0));
  selectionLimitReached = computed(() => this.selectedSeats().length >= this.totalTickets());

  constructor(
    private route: ActivatedRoute,
    private cinemaService: AbstractCinemaService
  ) {
    this.order.set(this.ticketTypes.map(tt => ({ ticketType: tt, quantity: 0 })));

    const session$ = this.route.paramMap.pipe(
      map(params => Number(params.get('sessionId'))),
      switchMap(id => this.cinemaService.getSessionDetails(id))
    );
    this.session = toSignal(session$);
  }

  increment(ticketId: 'inteira' | 'meia'): void {
    this.order.update(currentOrder => 
      currentOrder.map(item => 
        item.ticketType.id === ticketId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  }

  decrement(ticketId: 'inteira' | 'meia'): void {
    this.order.update(currentOrder => 
      currentOrder.map(item => 
        (item.ticketType.id === ticketId && item.quantity > 0)
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  }

  toggleSeat(seat: Seat): void {
    if (seat.status === 'occupied') {
      return;
    }
    
    if (seat.status === 'selected') {
      seat.status = 'available';
      this.selectedSeats.update(seats => seats.filter(s => s.id !== seat.id));
    } else {
      if (!this.selectionLimitReached()) {
        seat.status = 'selected';
        this.selectedSeats.update(seats => [...seats, seat]);
      } else {
        alert(`Você só pode selecionar ${this.totalTickets()} lugares.`);
      }
    }
  }
}
