// src/app/payment/payment.component.ts
import { Component, signal, inject, computed } from '@angular/core'; // Adicionar computed
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../order/services/order.service';
import { FinalizedOrder } from '../../order/models/finalized-order.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  orderService = inject(OrderService);
  router = inject(Router);
  location = inject(Location);

  paymentMethod = signal<'NONE' | 'PIX'>('NONE');
  cpf = signal('');
  showQrCodeView = signal(false);
  finalizedOrderDetails = signal<FinalizedOrder | undefined>(undefined);

  //Sinal computado para formatar os assentos de forma segura
  selectedSeatsText = computed(() => {
    const seats = this.orderService.selectedSeats();
    if (!seats || seats.length === 0) {
      return '';
    }
    return seats.map(s => s.id).join(', ');
  });

  constructor() {
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
