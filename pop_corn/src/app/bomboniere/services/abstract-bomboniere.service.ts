import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { BomboniereProduct } from '../models/bomboniere.model';
import { OperationResult } from '../../models/operation-result.model';

export abstract class AbstractBomboniereService {
  abstract products: Signal<BomboniereProduct[]>;

  // Métodos de CRUD para a administração
  abstract addProduct(product: Omit<BomboniereProduct, 'id'>): Observable<OperationResult<BomboniereProduct>>;
  abstract updateProduct(product: BomboniereProduct): Observable<OperationResult<BomboniereProduct>>;
  abstract deleteProduct(productId: number): Observable<OperationResult<void>>;
}
