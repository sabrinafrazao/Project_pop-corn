import { Provider } from "@angular/core";
import { environment } from "../../../environment/environment";
import { AbstractMovieService } from "./abstract-movie.service";
import { MockMovieService } from "./mock-movie.service";
import { MovieService } from "./movie.service";

export const MovieProvider: Provider = {
    provide: AbstractMovieService,
    useClass: environment.useMockService ? MockMovieService : MovieService
};