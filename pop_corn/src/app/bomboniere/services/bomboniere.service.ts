import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractBomboniereService } from './abstract-bomboniere.service';
import { BomboniereProduct } from '../models/bomboniere.model';
import { OperationResult } from '../../models/operation-result.model';
import { environment } from '../../../environment/environment';

@Injectable()
export class BomboniereService implements AbstractBomboniereService {
  private apiUrl = `${environment.apiUrl}/bomboniere`;
  products = signal<BomboniereProduct[]>([]);

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.http.get<BomboniereProduct[]>(this.apiUrl).subscribe(products => {
      this.products.set(products);
    });
  }

  // --- Implementação dos métodos de CRUD com chamadas HTTP ---

  addProduct(productData: Omit<BomboniereProduct, 'id'>): Observable<OperationResult<BomboniereProduct>> {
    return this.http.post<OperationResult<BomboniereProduct>>(this.apiUrl, productData).pipe(
      tap(result => {
        if (result.success) {
          // Adiciona o novo produto à lista local após a confirmação da API
          this.products.update(currentProducts => [...currentProducts, result.data]);
        }
      })
    );
  }

  updateProduct(product: BomboniereProduct): Observable<OperationResult<BomboniereProduct>> {
    return this.http.put<OperationResult<BomboniereProduct>>(`${this.apiUrl}/${product.id}`, product).pipe(
      tap(result => {
        if (result.success) {
          // Atualiza o produto na lista local
          this.products.update(currentProducts =>
            currentProducts.map(p => p.id === result.data.id ? result.data : p)
          );
        }
      })
    );
  }

  deleteProduct(productId: number): Observable<OperationResult<void>> {
    return this.http.delete<OperationResult<void>>(`${this.apiUrl}/${productId}`).pipe(
      tap(result => {
        if (result.success) {
          // Remove o produto da lista local
          this.products.update(currentProducts =>
            currentProducts.filter(p => p.id !== productId)
          );
        }
      })
    );
  }
}
