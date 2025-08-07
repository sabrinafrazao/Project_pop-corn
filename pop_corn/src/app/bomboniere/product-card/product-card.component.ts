import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { BomboniereProduct } from '../models/bomboniere.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input({ required: true }) product!: BomboniereProduct;
  @Output() quantityChange = new EventEmitter<{ quantity: number; product: BomboniereProduct }>();

  quantity = signal(0);

  increment() {
    this.quantity.update(q => q + 1);
    this.emitChange();
  }

  decrement() {
    if (this.quantity() > 0) {
      this.quantity.update(q => q - 1);
      this.emitChange();
    }
  }

  private emitChange() {
    this.quantityChange.emit({ quantity: this.quantity(), product: this.product });
  }
}