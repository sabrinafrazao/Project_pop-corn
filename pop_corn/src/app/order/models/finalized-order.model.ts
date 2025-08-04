import { Seat } from '../../cinemas/models/seat.model';
import { Order as TicketOrder } from '../../booking/models/ticket.model';
import { BomboniereOrder } from '../../bomboniere/models/bomboniere.model';

export interface FinalizedOrder {
  orderId: string;
  orderDate: Date;
  status: 'Aguardando Pagamento' | 'Pago' | 'Cancelado';
  cpf: string;
  totalPrice: number;
  
  // Detalhes do pedido adicionados
  movieTitle: string;
  movieImage: string;
  cinemaName: string;
  sessionTime: string;
  
  selectedSeats: Seat[];
  ticketOrder: TicketOrder[];
  bomboniereOrder: BomboniereOrder[];

  // Detalhes do PIX
  pixQrCode: string;
  pixCopyPaste: string;
}
