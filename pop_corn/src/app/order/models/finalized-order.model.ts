import { Seat } from '../../cinemas/models/seat.model';
import { Order as TicketOrder } from '../../booking/models/ticket.model';
import { BomboniereOrder } from '../../bomboniere/models/bomboniere.model';

// A interface agora vive em seu próprio arquivo, limpa e reutilizável.
export interface FinalizedOrder {
  orderId: string;
  orderDate: Date;
  status: 'Aguardando Pagamento' | 'Pago' | 'Cancelado';
  cpf: string;
  totalPrice: number;
  
  // Itens do pedido
  selectedSeats: Seat[];
  ticketOrder: TicketOrder[];
  bomboniereOrder: BomboniereOrder[];

  // Detalhes do PIX (para exibição)
  pixQrCode: string;
  pixCopyPaste: string;
}