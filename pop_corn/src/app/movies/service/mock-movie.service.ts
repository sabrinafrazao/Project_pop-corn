import { Injectable, signal, WritableSignal } from '@angular/core';
import { Movie } from '../models/movies.model'; 
import { AbstractMovieService } from './abstract-movie.service';
import { Observable, of } from 'rxjs'; // Importe 'of' do RxJS
import { OperationResult } from '../../models/operation-result.model'; 

@Injectable()
export class MockMovieService implements AbstractMovieService {
    movies: WritableSignal<Movie[]> = signal([
        {
        id: 1,
        title: 'John Wick 4',
        image: 'assets/images/johnWick.png',
        genre: 'Ação, Suspense, Drama',
        duration: '2h49min',
        rating: 4.7,
        votes: 45922,
        synopsis: 'Com o preço por sua cabeça cada vez maior, o lendário assassino de aluguel John Wick leva sua luta contra o High Table global enquanto procura os jogadores mais poderosos do submundo, de Nova York a Paris, do Japão a Berlim.'
        },
        {
        id: 2,
        title: 'Vingadores: Ultimato',
        image: 'assets/images/avengers.png',
        genre: 'Ação, Ficção, Super-herói',
        duration: '3h01min',
        rating: 4.8,
        votes: 125394,
        synopsis: 'Após os eventos devastadores de "Guerra Infinita", o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem mais uma vez para reverter as ações de Thanos e restaurar o equilíbrio do universo.'
        }
    ]);

    refresh(): void {
        console.log("Mock Refresh Called: No action needed.");
    }

    add(movie: Omit<Movie, "id">): Observable<OperationResult> {
        const newMovie = { ...movie, synopsis: 'Sinopse padrão para novo filme', id: Date.now() }; // Garante que a sinopse exista
        this.movies.update(currentMovies => [...currentMovies, newMovie]);
        return of({ success: true, data: newMovie });
    }

    update(movie: Movie): Observable<OperationResult> {
        this.movies.update(movies => movies.map(m => m.id === movie.id ? movie : m));
        return of({ success: true, data: movie });
    }

    remove(id: number): Observable<OperationResult> {
        this.movies.update(movies => movies.filter(m => m.id !== id));
        return of({ success: true });
    }
}