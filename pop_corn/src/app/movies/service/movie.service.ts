import { computed, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractMovieService } from './abstract-movie.service';
import { Movie } from '../models/movies.model';
import { OperationResult } from '../../models/operation-result.model';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class MovieService extends AbstractMovieService {
    override overrideMovies(movies: Movie[]): void {
      throw new Error('Method not implemented.');
    }
    // Sinal privado que armazena o estado
    private _movies = signal<Movie[]>([]);
    // Sinal público e somente leitura, derivado do privado
    override movies: Signal<Movie[]> = computed(() => this._movies());

    private apiUrl = 'http://api.po&corn.com/movies';

    constructor(private http: HttpClient) {
        super();
        this.refresh();
    }

    override refresh(): void {
        this.http.get<Movie[]>(this.apiUrl)
            .pipe(tap(apiMovies => this._movies.set(apiMovies)))
            .subscribe();
    }

    override add(movie: Omit<Movie, 'id'>): Observable<OperationResult> {

        return of({ success: true });
    }

    override remove(id: number): Observable<OperationResult> {

        return of({ success: true });
    }

    override update(movie: Movie): Observable<OperationResult> {

        return of({ success: true });
    }

    override search(query: any): Observable<OperationResult> {
        return of()
    }
}
