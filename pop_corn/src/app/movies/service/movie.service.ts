import { computed, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractMovieService } from './abstract-movie.service';
import { Movie } from '../models/movies.model';
import { OperationResult } from '../../models/operation-result.model';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class MovieService extends AbstractMovieService {
    // Sinal privado que armazena o estado
    private _movies = signal<Movie[]>([]);
    // Sinal público e somente leitura, derivado do privado
    override movies: Signal<Movie[]> = computed(() => this._movies());

    private apiUrl = 'http://api.po&corn.com/movies'; // Exemplo de API só pra não dar erro

    constructor(private http: HttpClient) {
        super();
        this.refresh(); // Carrega os dados assim que o serviço é criado
    }

    override refresh(): void {
        this.http.get<Movie[]>(this.apiUrl)
            .pipe(tap(apiMovies => this._movies.set(apiMovies))) // Atualiza o sinal privado
            .subscribe();
    }

    override add(movie: Omit<Movie, 'id'>): Observable<OperationResult> {
        // Lógica para adicionar via API
        return of({ success: true });
    }

    override remove(id: number): Observable<OperationResult> {
        // Lógica para remover via API
        return of({ success: true });
    }

    override update(movie: Movie): Observable<OperationResult> {
        // Lógica para atualizar via API
        return of({ success: true });
    }
}