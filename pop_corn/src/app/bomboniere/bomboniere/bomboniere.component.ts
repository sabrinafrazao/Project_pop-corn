import { Component, inject, computed } from '@angular/core'; // Adicionar computed
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractOrderService } from '../../order/services/abstract-order.service';
import { AbstractBomboniereService } from '../services/abstract-bomboniere.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { BomboniereProduct } from '../models/bomboniere.model';

@Component({
  selector: 'app-bomboniere',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './bomboniere.component.html',
  styleUrls: ['./bomboniere.component.scss']
})
export class BomboniereComponent {
  orderService = inject(AbstractOrderService);
  bomboniereService = inject(AbstractBomboniereService);
  router = inject(Router);
  location = inject(Location);

  products = this.bomboniereService.products;
  bomboniereSelected = this.orderService.bomboniereOrder;

  // NOVO: Sinal computado para formatar os assentos de forma segura
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
    this.router.navigate(['/payment']); 
  }
}
