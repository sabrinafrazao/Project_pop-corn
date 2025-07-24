import { Signal } from "@angular/core";
import { Movie } from "../models/movies.model";
import { Observable } from "rxjs";
import { OperationResult } from "../../models/operation-result.model";



export abstract class AbstractMovieService {
  // O estado principal: uma lista de filmes como um Signal
  abstract movies: Signal<Movie[]>;

  // Um método para dizer ao serviço para buscar/atualizar a lista de filmes
  abstract refresh(): void;

  // Métodos de escrita: retornam Observables com o resultado da operação
  abstract add(movie: Omit<Movie, "id">): Observable<OperationResult>;
  abstract update(movie: Movie): Observable<OperationResult>;
  abstract remove(id: number): Observable<OperationResult>;
  abstract search(query: string): Observable<OperationResult>;
  abstract overrideMovies(movies: Movie[]): void;
}
