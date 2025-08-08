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
  orderService = inject(AbstractOrderService);
  router = inject(Router);
  location = inject(Location);

  paymentMethod = signal<'NONE' | 'PIX'>('NONE');
  cpf = signal('');
  showQrCodeView = signal(false);
  finalizedOrderDetails = signal<FinalizedOrder | undefined>(undefined);

  selectedSeatsText = computed(() => {
    const seats = this.orderService.selectedSeats();
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
    
    // --- CORREÇÃO AQUI ---
    // Agora nos inscrevemos no Observable para disparar a chamada à API.
    this.orderService.finalizeOrder(this.cpf()).subscribe(result => {
      if (result.success && result.data) {
        this.finalizedOrderDetails.set(result.data as FinalizedOrder);
        this.showQrCodeView.set(true);
      } else {
        alert("Ocorreu um erro ao finalizar o pedido. Tente novamente.");
        console.error("Erro ao finalizar pedido:", result.data);
      }
    });
    // ---------------------
  }

  goToMyOrders() {
    this.router.navigate(['/meus-pedidos']);
  }

  goBack(): void {
    this.location.back();
  }
}
