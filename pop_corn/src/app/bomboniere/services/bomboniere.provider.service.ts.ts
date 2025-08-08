import { Provider } from '@angular/core';
import { environment } from '../../../environment/environment';
import { AbstractBomboniereService } from './abstract-bomboniere.service';
import { MockBomboniereService } from './mock-bomboniere.service';
import { BomboniereService } from './bomboniere.service';

export const BomboniereProvider: Provider = {
  provide: AbstractBomboniereService,
  useClass: environment.useMockService ? MockBomboniereService : BomboniereService
};