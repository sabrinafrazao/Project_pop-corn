import { Provider } from "@angular/core";
import { environment } from "../../../environment/environment";
import { AbstractCinemaService } from "./abstract-cinema.service";
import { MockCinemaService } from "./mock-cinema.service";
import { CinemaService } from "./cinema.service";

export const CinemaProvider: Provider = {
  provide: AbstractCinemaService,
  useClass: environment.useMockService ? MockCinemaService : CinemaService
};