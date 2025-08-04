import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AbstractBomboniereService } from './abstract-bomboniere.service';
import { BomboniereProduct } from '../models/bomboniere.model';
import { OperationResult } from '../../models/operation-result.model';

@Injectable({
  providedIn: 'root'
})
export class MockBomboniereService implements AbstractBomboniereService {
  private readonly mockProducts: BomboniereProduct[] = [
    { 
      id: 1, 
      name: 'Pipoca Pequena', 
      description: 'A porção ideal de pipoca com manteiga para quem busca um lanche rápido e delicioso.', 
      price: 18.00, 
      image: 'assets/images/Pipoca_pequena.png'
    },
    { 
      id: 2, 
      name: 'Pipoca Média', 
      description: 'Pipoca na medida certa para acompanhar o seu filme, crocante e com um toque de manteiga.', 
      price: 22.00, 
      image: 'assets/images/Pipoca_media.png'
    },
    { 
      id: 3, 
      name: 'Pipoca Grande', 
      description: 'Uma porção generosa da nossa pipoca especial com manteiga, perfeita para dividir ou para os verdadeiros fãs.', 
      price: 26.00, 
      image: 'assets/images/Pipoca_grande.png'
    },
    { 
      id: 4, 
      name: 'Balde de Pipoca', 
      description: 'O nosso balde colecionável cheio de pipoca quentinha. Ideal para uma experiência de cinema completa!', 
      price: 35.00, 
      image: 'assets/images/balde_pipoca.png'
    },
    { 
      id: 5, 
      name: 'Refrigerante em Copo', 
      description: '500ml do seu refrigerante preferido para refrescar. Escolha entre Coca-Cola, Guaraná e mais.', 
      price: 12.00, 
      image: 'assets/images/refri-copo.png'
    },
    { 
      id: 6, 
      name: 'Refrigerante em Lata', 
      description: 'A opção clássica e gelada em lata de 350ml. Praticidade e sabor para o seu filme.', 
      price: 9.00, 
      image: 'assets/images/refri_lata.png'
    },
    { 
      id: 7, 
      name: 'Fanta em Lata', 
      description: 'O sabor inconfundível e refrescante da Fanta Laranja em uma lata de 350ml.', 
      price: 9.00, 
      image: 'assets/images/fanta_lata.png'
    },
  ];

  products = signal<BomboniereProduct[]>(this.mockProducts);

  constructor() { }

  // --- Implementação dos métodos de CRUD ---

  addProduct(productData: Omit<BomboniereProduct, 'id'>): Observable<OperationResult<BomboniereProduct>> {
    const newId = Math.max(...this.products().map(p => p.id)) + 1;
    const newProduct: BomboniereProduct = { id: newId, ...productData };
    
    this.products.update(currentProducts => [...currentProducts, newProduct]);
    
    console.log('[Mock] Produto adicionado:', newProduct);
    return of({ success: true, data: newProduct });
  }

  updateProduct(updatedProduct: BomboniereProduct): Observable<OperationResult<BomboniereProduct>> {
    this.products.update(currentProducts => 
      currentProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );

    console.log('[Mock] Produto atualizado:', updatedProduct);
    return of({ success: true, data: updatedProduct });
  }

  deleteProduct(productId: number): Observable<OperationResult<void>> {
    this.products.update(currentProducts => 
      currentProducts.filter(p => p.id !== productId)
    );

    console.log('[Mock] Produto removido, ID:', productId);
    return of({ success: true });
  }
}
