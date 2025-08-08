import { Seat } from '../../cinemas/models/seat.model';
import { Order as TicketOrder } from '../../booking/models/ticket.model';
import { BomboniereOrder } from '../../bomboniere/models/bomboniere.model';

export interface FinalizedOrder {
  orderId: string;
  orderDate: Date;
  status: 'Aguardando Pagamento' | 'Pago' | 'Cancelado';
  cpf: string;
  totalPrice: number;
  
  // --- CORREÇÃO AQUI ---
  // Alterado de camelCase para snake_case para corresponder à API
  user_id: string;
  cinema_id: number;
  // ---------------------

  movieTitle: string;
  movieImage: string;
  cinemaName: string;
  sessionTime: string;
  
  selectedSeats: Seat[];
  ticketOrder: TicketOrder[];
  bomboniereOrder: BomboniereOrder[];

  pixQrCode: string;
  pixCopyPaste: string;
}
