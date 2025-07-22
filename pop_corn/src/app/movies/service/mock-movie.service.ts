import { Injectable, signal, WritableSignal } from '@angular/core';
import { Movie } from '../models/movies.model'; 
import { AbstractMovieService } from './abstract-movie.service';
import { Observable, of } from 'rxjs'; // Importe 'of' do RxJS
import { OperationResult } from '../../models/operation-result.model'; 

@Injectable()
export class MockMovieService implements AbstractMovieService {
  // Usamos um 'writableSignal' para poder modificar o estado internamente
  movies: WritableSignal<Movie[]> = signal([
    {
    id: 1,
    title: 'John Wick 4',
    image: 'assets/images/johnWick.png',
    genre: 'Ação, Suspense, Drama',
    duration: '2h49min',
    rating: 4.7,
    votes: 45922
    },
    {
        id: 2,
        title: 'Vingadores: Ultimato',
        image: 'assets/images/avengers.png',
        genre: 'Ação, Ficção, Super-herói',
        duration: '3h01min',
        rating: 4.8,
        votes: 125394
    },

    {
        id: 3,
        title: 'Vingadores: Ultimato',
        image: 'assets/images/avengers.png',
        genre: 'Ação, Ficção, Super-herói',
        duration: '3h01min',
        rating: 4.8,
        votes: 125394
    },

    {
        id: 4,
        title: 'Vingadores: Ultimato',
        image: 'assets/images/avengers.png',
        genre: 'Ação, Ficção, Super-herói',
        duration: '3h01min',
        rating: 4.8,
        votes: 125394
    },
  ]);

  refresh(): void {
    console.log("Mock Refresh Called: No action needed.");
  }

  // 'of()' para criar um Observable que emite um valor imediatamente
  add(movie: Omit<Movie, "id">): Observable<OperationResult> {
    const newMovie = { ...movie, id: Date.now() }; // Cria um ID único
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