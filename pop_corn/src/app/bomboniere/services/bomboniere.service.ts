// src/app/bomboniere/services/bomboniere.service.ts
import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { AbstractBomboniereService } from './abstract-bomboniere.service';
import { BomboniereProduct } from '../models/bomboniere.model';
import { OperationResult } from '../../models/operation-result.model';
import { environment } from '../../../environment/environment';

@Injectable()
export class BomboniereService implements AbstractBomboniereService {
  private apiUrl = `${environment.apiUrl}/bomboniere`;
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  
  products = signal<BomboniereProduct[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
    }
  }

  private loadProducts(): void {
    this.http.get<BomboniereProduct[]>(this.apiUrl).subscribe(products => {
      this.products.set(products);
    });
  }

  addProduct(productData: Omit<BomboniereProduct, 'id'>): Observable<OperationResult<BomboniereProduct>> {
    return this.http.post<BomboniereProduct>(this.apiUrl, productData).pipe(
      tap(() => this.loadProducts()),
      map(newProduct => ({ success: true, data: newProduct })),
      catchError(err => of({ success: false, data: err }))
    );
  }

  updateProduct(product: BomboniereProduct): Observable<OperationResult<BomboniereProduct>> {
    return this.http.put<BomboniereProduct>(`${this.apiUrl}/${product.id}`, product).pipe(
      tap(() => this.loadProducts()),
      map(updatedProduct => ({ success: true, data: updatedProduct })),
      catchError(err => of({ success: false, data: err }))
    );
  }

  deleteProduct(productId: number): Observable<OperationResult<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`).pipe(
      tap(() => this.loadProducts()),
      map(() => ({ success: true })),
      catchError(err => of({ success: false, data: err }))
    );
  }
}
