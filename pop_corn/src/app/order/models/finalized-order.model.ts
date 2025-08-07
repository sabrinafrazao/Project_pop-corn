import { Seat } from '../../cinemas/models/seat.model';
import { Order as TicketOrder } from '../../booking/models/ticket.model';
import { BomboniereOrder } from '../../bomboniere/models/bomboniere.model';

export interface FinalizedOrder {
  orderId: string;
  orderDate: Date;
  status: 'Aguardando Pagamento' | 'Pago' | 'Cancelado';
  cpf: string;
  totalPrice: number;
  
  userId: string;
  cinemaId: number;

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