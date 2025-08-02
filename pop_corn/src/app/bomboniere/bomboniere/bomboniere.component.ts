// src/app/bomboniere/bomboniere.component.ts
import { CommonModule, Location } from '@angular/common';
import { Component, computed, inject } from '@angular/core'; // Adicionar 'computed'
import { Router } from '@angular/router';
import { OrderService } from '../../order/services/order.service';
import { BomboniereService } from '../bomboniere.service';
import { BomboniereProduct } from '../models/bomboniere.model';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-bomboniere',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './bomboniere.component.html',
  styleUrls: ['./bomboniere.component.scss']
})

export class BomboniereComponent {
  orderService = inject(OrderService);
  bomboniereService = inject(BomboniereService);
  router = inject(Router);
  location = inject(Location);

  products = this.bomboniereService.products;
  
  // Sinal computado para formatar os assentos de forma segura
  selectedSeatsText = computed(() => {
    const seats = this.orderService.selectedSeats();
    if (!seats || seats.length === 0) {
      return '';
    }
    return seats.map(s => s.id).join(', ');
  });

  constructor() {
    // Se o pedido estiver vazio (ex: F5 na página), volta para o início
    if (this.orderService.selectedSeats().length === 0) {
      this.router.navigate(['/']);
    }
  }

  handleQuantityChange(event: { quantity: number; product: BomboniereProduct }) {
    this.orderService.updateBomboniereOrder(event.product.id, event.quantity, event.product);
  }

  goBack(): void {
    this.location.back();
  }

  proceedToPayment(): void {
    // Lógica para navegar para a tela de pagamento final
    this.router.navigate(['/payment']); 

  }
}