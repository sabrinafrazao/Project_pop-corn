import { Signal } from "@angular/core";
import { Movie } from "../models/movies.model";
import { Observable } from "rxjs";
import { OperationResult } from "../../models/operation-result.model";



export abstract class AbstractMovieService {
  abstract movies: Signal<Movie[]>;
  refresh(): void {
  console.log("Mock refresh chamado - dados atualizados.");}
  abstract add(movie: Omit<Movie, "id">): Observable<OperationResult>;
  abstract update(movie: Movie): Observable<OperationResult>;
  abstract remove(id: number): Observable<OperationResult>;
  abstract search(query: string): Observable<OperationResult>;
  abstract overrideMovies(movies: Movie[]): void;
}
