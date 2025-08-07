// src/app/order/services/order.provider.service.ts
import { Provider } from '@angular/core';
import { environment } from '../../../environment/environment';
import { AbstractOrderService } from './abstract-order.service';
import { MockOrderService } from './mock-order.service';
import { OrderService } from './order.service';

export const OrderProvider: Provider = {
  provide: AbstractOrderService,
  useClass: environment.production ? OrderService : MockOrderService
};
