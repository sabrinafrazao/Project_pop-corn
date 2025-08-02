import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Seat } from '../../cinemas/models/seat.model';
import { Order as TicketOrder } from '../../booking/models/ticket.model';
import { BomboniereOrder, BomboniereProduct } from '../../bomboniere/models/bomboniere.model';
import { FinalizedOrder } from '../models/finalized-order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // Injeta o PLATFORM_ID para saber se estamos no servidor ou no navegador
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'popCornOrders';

  // Estado do Pedido ATIVO
  selectedSeats = signal<Seat[]>([]);
  ticketOrder = signal<TicketOrder[]>([]);
  bomboniereOrder = signal<BomboniereOrder[]>([]);

  // A lista de pedidos finalizados
  completedOrders = signal<FinalizedOrder[]>([]);

  // Sinais Computados
  totalTicketPrice = computed(() => this.ticketOrder().reduce((acc, item) => acc + (item.quantity * item.ticketType.price), 0));
  totalBombonierePrice = computed(() => this.bomboniereOrder().reduce((acc, item) => acc + (item.quantity * item.product.price), 0));
  totalPrice = computed(() => this.totalTicketPrice() + this.totalBombonierePrice());

  constructor() {
    // A lógica que usa localStorage agora SÓ RODA NO NAVEGADOR
    if (isPlatformBrowser(this.platformId)) {
      // 1. Carrega os pedidos salvos do localStorage ao iniciar
      this.completedOrders.set(this.loadOrdersFromStorage());

      // 2. Cria um "efeito" que salva automaticamente no localStorage sempre que a lista de pedidos mudar
      effect(() => {
        this.saveOrdersToStorage(this.completedOrders());
      });
    }
  }

  // --- Métodos para o pedido ATIVO ---
  setTickets(seats: Seat[], tickets: TicketOrder[]) {
    this.selectedSeats.set(seats);
    this.ticketOrder.set(tickets);
  }

  updateBomboniereOrder(productId: number, quantity: number, product: BomboniereProduct) {
    this.bomboniereOrder.update(currentOrder => {
      const existingItemIndex = currentOrder.findIndex(item => item.product.id === productId);
      if (quantity > 0) {
        if (existingItemIndex > -1) {
          currentOrder[existingItemIndex].quantity = quantity;
        } else {
          currentOrder.push({ product, quantity });
        }
      } else if (existingItemIndex > -1) {
        currentOrder.splice(existingItemIndex, 1);
      }
      return [...currentOrder];
    });
  }

  // --- Método para Finalizar o Pedido ---
  finalizeOrder(cpf: string): FinalizedOrder {
    const newFinalizedOrder: FinalizedOrder = {
      orderId: `PC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      orderDate: new Date(),
      status: 'Aguardando Pagamento',
      cpf,
      totalPrice: this.totalPrice(),
      selectedSeats: this.selectedSeats(),
      ticketOrder: this.ticketOrder(),
      bomboniereOrder: this.bomboniereOrder(),
      pixQrCode: 'assets/images/fake-qr-code.png',
      pixCopyPaste: Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
    };

    this.completedOrders.update(orders => [...orders, newFinalizedOrder]);
    this.resetActiveOrder();
    return newFinalizedOrder;
  }

  private resetActiveOrder() {
    this.selectedSeats.set([]);
    this.ticketOrder.set([]);
    this.bomboniereOrder.set([]);
  }

  // --- MÉTODOS DE PERSISTÊNCIA (AGORA SEGUROS) ---
  private saveOrdersToStorage(orders: FinalizedOrder[]) {
    // Adiciona uma verificação para garantir que só salve no navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    }
  }

  private loadOrdersFromStorage(): FinalizedOrder[] {
    // Adiciona uma verificação para garantir que só leia no navegador
    if (isPlatformBrowser(this.platformId)) {
      const savedOrders = localStorage.getItem(this.STORAGE_KEY);
      return savedOrders ? JSON.parse(savedOrders) : [];
    }
    // Se estiver no servidor, retorna um array vazio
    return [];
  }
}
