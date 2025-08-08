// src/app/movies/service/movie.service.ts

import { computed, Injectable, Signal, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AbstractMovieService } from './abstract-movie.service';
import { Movie } from '../models/movies.model';
import { OperationResult } from '../../models/operation-result.model';
import { Observable, of, tap, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable()
export class MovieService extends AbstractMovieService {
    private apiUrl = `${environment.apiUrl}/movies`;
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

    private _movies = signal<Movie[]>([]);
    override movies: Signal<Movie[]> = computed(() => this._movies());

    constructor() {
        super();
        if (isPlatformBrowser(this.platformId)) {
            this.refresh();
        }
    }

    override refresh(): void {
        this.http.get<Movie[]>(this.apiUrl).pipe(
            catchError((error: HttpErrorResponse) => {
                // --- CORREÇÃO ADICIONADA ---
                // Captura e exibe qualquer erro que ocorra durante a busca de filmes.
                console.error("Falha ao buscar filmes:", error);
                alert("Não foi possível carregar os filmes. Verifique o console para mais detalhes.");
                return throwError(() => new Error('Erro ao carregar filmes.'));
                // ---------------------------
            })
        ).subscribe(apiMovies => {
            this._movies.set(apiMovies);
        });
    }

    override add(movie: Omit<Movie, 'id'>): Observable<OperationResult> {
        return this.http.post<Movie>(this.apiUrl, movie).pipe(
            tap(() => this.refresh()),
            map(newMovie => ({ success: true, data: newMovie })),
            catchError(error => of({ success: false, data: error }))
        );
    }

    override update(movie: Movie): Observable<OperationResult> {
        return this.http.put<Movie>(`${this.apiUrl}/${movie.id}`, movie).pipe(
            tap(() => this.refresh()),
            map(updatedMovie => ({ success: true, data: updatedMovie })),
            catchError(error => of({ success: false, data: error }))
        );
    }

    override remove(id: number): Observable<OperationResult> {
        return this.http.delete<Movie>(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.refresh()),
            map(() => ({ success: true })),
            catchError(error => of({ success: false, data: error }))
        );
    }
    
    override search(query: string): Observable<OperationResult> {
        if (!query.trim()) {
            return of({ success: true, data: this.movies() });
        }
        return this.http.get<Movie[]>(`${this.apiUrl}/search`, { params: { query } }).pipe(
            map(filteredMovies => ({ success: true, data: filteredMovies })),
            catchError(error => of({ success: false, data: error }))
        );
    }

    overrideMovies(movies: Movie[]): void {}
}
