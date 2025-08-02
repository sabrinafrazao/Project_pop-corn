// src/app/booking/booking.component.ts
import { CommonModule, Location } from '@angular/common';
import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';

import { Seat } from '../cinemas/models/seat.model';
import { Session } from '../cinemas/models/session.model';
import { AbstractCinemaService } from '../cinemas/service/abstract-cinema.service';
import { Movie } from '../movies/models/movies.model';
import { AbstractMovieService } from '../movies/service/abstract-movie.service';
import { OrderService } from '../order/services/order.service';
import { Order, TicketType } from './models/ticket.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  // Injeção de dependências
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cinemaService = inject(AbstractCinemaService);
  private movieService = inject(AbstractMovieService);
  private location = inject(Location);
  private orderService = inject(OrderService);

  // Sinais de estado
  session: Signal<Session | undefined>;
  movie: Signal<Movie | undefined>;
  cinemaInfo = signal<{ cinemaName: string; roomName: string } | undefined>(undefined);

  ticketTypes: TicketType[] = [
    { id: 'inteira', name: 'Inteira', price: 30.00 },
    { id: 'meia', name: 'Meia-entrada', price: 15.00 }
  ];

  selectedSeats = signal<Seat[]>([]);
  order: WritableSignal<Order[]> = signal([]);

  // Sinais computados
  totalSeatsSelected = computed(() => this.selectedSeats().length);
  totalTicketsInOrder = computed(() => this.order().reduce((acc, item) => acc + item.quantity, 0));
  canAddMoreTickets = computed(() => this.totalTicketsInOrder() < this.totalSeatsSelected());
  isOrderComplete = computed(() => this.totalSeatsSelected() > 0 && this.totalSeatsSelected() === this.totalTicketsInOrder());

  constructor() {
    const session$ = this.route.paramMap.pipe(
      map(params => Number(params.get('sessionId'))),
      switchMap(id => this.cinemaService.getSessionDetails(id)),
      tap(session => {
        if (session) {
          // ===== PONTO PRINCIPAL DA CORREÇÃO =====
          // A lógica de inicialização/restauração agora acontece AQUI,
          // depois que a sessão foi carregada.

          const existingSeats = this.orderService.selectedSeats();
          const existingTickets = this.orderService.ticketOrder();

          // Verifica se há um pedido válido no serviço para restaurar
          if (existingSeats.length > 0 && existingTickets.length > 0 && existingTickets.some(t => t.quantity > 0)) {
            // 1. Restaura a contagem de ingressos do serviço
            this.order.set(existingTickets);
            
            // 2. Restaura a lista de assentos selecionados
            this.selectedSeats.set(existingSeats);

            // 3. Sincroniza o estado visual do mapa de assentos
            session.seatMap.forEach(row => {
              row.forEach(seat => {
                seat.status = existingSeats.some(s => s.id === seat.id) ? 'selected' : seat.status;
              });
            });
          } else {
            // Se NÃO houver pedido no serviço, inicia um novo do zero
            this.order.set(this.ticketTypes.map(tt => ({ ticketType: tt, quantity: 0 })));
            this.selectedSeats.set([]);
          }

          // Carrega as informações do cinema
          this.loadCinemaInfo(session);
        }
      })
    );
    this.session = toSignal(session$);
    this.movie = toSignal(
        session$.pipe(map(session => session ? this.movieService.movies().find(m => m.id === session.movieId) : undefined))
    );
  }
  
  private loadCinemaInfo(session: Session): void {
    this.cinemaService.loadSessionsByMovie(session.movieId);
    const cinemas = this.cinemaService.cinemas();
    for (const cinema of cinemas) {
      for (const room of cinema.rooms) {
        if (room.sessions.some(s => s.id === session.id)) {
          this.cinemaInfo.set({ cinemaName: cinema.name, roomName: room.name });
          return;
        }
      }
    }
  }

  // --- Métodos de Interação ---

  goBack(): void {
    this.location.back();
  }
  
  continueToBomboniere(): void {
    this.orderService.setTickets(this.selectedSeats(), this.order());
    this.router.navigate(['/bomboniere']);
  }

  increment(ticketId: 'inteira' | 'meia'): void {
    if (this.canAddMoreTickets()) {
      this.order.update(currentOrder => 
        currentOrder.map(item => 
          item.ticketType.id === ticketId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    }
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
    if (seat.status === 'occupied') return;
    
    const isSelected = this.selectedSeats().some(s => s.id === seat.id);

    if (isSelected) {
      seat.status = 'available';
      this.selectedSeats.update(seats => seats.filter(s => s.id !== seat.id));
    } else {
      seat.status = 'selected';
      this.selectedSeats.update(seats => [...seats, seat]);
    }
    
    this.resetOrderIfInvalid();
  }

  private resetOrderIfInvalid(): void {
    if (this.totalTicketsInOrder() > this.totalSeatsSelected()) {
      this.order.set(this.ticketTypes.map(tt => ({ ticketType: tt, quantity: 0 })));
    }
  }

  get totalPrice(): number {
    return this.order().reduce((acc, item) => acc + (item.quantity * item.ticketType.price), 0);
  }
}