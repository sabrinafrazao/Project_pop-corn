import { computed, Injectable, Signal, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractMovieService } from './abstract-movie.service';
import { Movie } from '../models/movies.model';
import { OperationResult } from '../../models/operation-result.model';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable()
export class MovieService extends AbstractMovieService {
    private apiUrl = `${environment.apiUrl}/api/movies`;
    private http = inject(HttpClient);

    private _movies = signal<Movie[]>([]);
    override movies: Signal<Movie[]> = computed(() => this._movies());

    constructor() {
        super();
        this.refresh();
    }

    override refresh(): void {
        this.http.get<Movie[]>(this.apiUrl)
            .pipe(tap(apiMovies => this._movies.set(apiMovies)))
            .subscribe();
    }

    override add(movie: Omit<Movie, 'id'>): Observable<OperationResult> {
        return this.http.post<OperationResult>(this.apiUrl, movie).pipe(
            tap(() => this.refresh()) // Atualiza a lista após adicionar
        );
    }

    override update(movie: Movie): Observable<OperationResult> {
        return this.http.put<OperationResult>(`${this.apiUrl}/${movie.id}`, movie).pipe(
            tap(() => this.refresh()) // Atualiza a lista após editar
        );
    }

    override remove(id: number): Observable<OperationResult> {
        return this.http.delete<OperationResult>(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.refresh()) // Atualiza a lista após remover
        );
    }
    
    // O search pode ser feito no frontend por simplicidade, ou no backend para performance
    override search(query: string): Observable<OperationResult> {
        const filtered = this.movies().filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase())
        );
        return of({ success: true, data: filtered });
    }

    overrideMovies(movies: Movie[]): void {
      // Este método é mais para o mock, pode ser deixado vazio aqui.
    }
}