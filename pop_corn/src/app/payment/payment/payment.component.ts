import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { AbstractOrderService } from '../../order/services/abstract-order.service';
import { FinalizedOrder } from '../../order/models/finalized-order.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  // CORRIGIDO: Injeta a classe abstrata
  orderService = inject(AbstractOrderService);
  router = inject(Router);
  location = inject(Location);

  // Sinais para controlar o estado da UI
  paymentMethod = signal<'NONE' | 'PIX'>('NONE');
  cpf = signal('');
  showQrCodeView = signal(false);
  finalizedOrderDetails = signal<FinalizedOrder | undefined>(undefined);

  // CORRIGIDO: Adicionado o sinal computado para formatar os assentos
  selectedSeatsText = computed(() => {
    const seats = this.orderService.selectedSeats();
    return seats.map(s => s.id).join(', ');
  });

  constructor() {
    // Proteção de rota: se não há itens no carrinho, volta pra home
    if (this.orderService.totalPrice() === 0) {
      this.router.navigate(['/']);
    }
  }

  selectPix() {
    this.paymentMethod.set('PIX');
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.cpf.set(input.value);
  }

  finalizeOrder() {
    if (this.cpf().length < 11) {
      alert('Por favor, insira um CPF válido.');
      return;
    }
    const finalizedOrder = this.orderService.finalizeOrder(this.cpf());
    this.finalizedOrderDetails.set(finalizedOrder);
    this.showQrCodeView.set(true);
  }

  goToMyOrders() {
    this.router.navigate(['/meus-pedidos']);
  }

  goBack(): void {
    this.location.back();
  }
}
