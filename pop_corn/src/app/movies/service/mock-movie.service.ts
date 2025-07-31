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
    synopsis: 'Após os eventos devastadores de "Guerra Infinita", o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem mais uma vez para reverter as ações de Thanos e restaurar o equilíbrio do universo.'
  },
  {
    id: 2,
    title: 'Vingadores: Guerra Infinita',
    image: 'assets/images/avengers.png',
    genre: 'Ação, Ficção, Super-herói',
    duration: '2h40min',
    rating: 4.8,
    votes: 120931,
    synopsis: 'Após os eventos devastadores de "Guerra Infinita", o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem mais uma vez para reverter as ações de Thanos e restaurar o equilíbrio do universo.'
  },
  {
    id: 3,
    title: 'É Assim Que Acaba',
    image: 'assets/images/queAcaba.png',
    genre: 'Romance, Drama',
    duration: '2h03min',
    rating: 4.6,
    votes: 9820,
    synopsis: 'Após os eventos devastadores de "Guerra Infinita", o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem mais uma vez para reverter as ações de Thanos e restaurar o equilíbrio do universo.'
  },
  {
    id: 4,
    title: 'Deadpool & Wolverine',
    image: 'assets/images/deadpool.png',
    genre: 'Ação, Comédia, Super-herói',
    duration: '2h15min',
    rating: 4.9,
    votes: 16402,
    synopsis: 'Após os eventos devastadores de "Guerra Infinita", o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem mais uma vez para reverter as ações de Thanos e restaurar o equilíbrio do universo.'
  },
  {
    id: 5,
    title: 'Batman vs Superman',
    image: 'assets/images/batman.png',
    genre: 'Ação, Super-herói, Drama',
    duration: '2h31min',
    rating: 4.0,
    votes: 94410,
    synopsis: 'Após os eventos devastadores de "Guerra Infinita", o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem mais uma vez para reverter as ações de Thanos e restaurar o equilíbrio do universo.'
  },
  {
    id: 6,
    title: 'Coringa',
    image: 'assets/images/coringa.png',
    genre: 'Drama, Thriller, Psicológico',
    duration: '2h02min',
    rating: 4.6,
    votes: 86213,
    synopsis: 'Após os eventos devastadores de "Guerra Infinita", o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem mais uma vez para reverter as ações de Thanos e restaurar o equilíbrio do universo.'
  },
  {
    id: 7,
    title: 'Avatar 2',
    image: 'assets/images/avatar.png',
    genre: 'Ficção, Aventura, Fantasia',
    duration: '3h12min',
    rating: 4.7,
    votes: 57427,
    synopsis: 'Após os eventos devastadores de "Guerra Infinita", o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem mais uma vez para reverter as ações de Thanos e restaurar o equilíbrio do universo.'
  },
  {
    id: 8,
    title: 'Shang-Chi',
    image: 'assets/images/shang.png',
    genre: 'Ação, Super-herói, Aventura',
    duration: '2h12min',
    rating: 4.5,
    votes: 48331,
    synopsis: 'Após os eventos devastadores de "Guerra Infinita", o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem mais uma vez para reverter as ações de Thanos e restaurar o equilíbrio do universo.'
  },
  {
    id: 9,
    title: 'Annabelle 3',
    image: 'assets/images/anabelle.png',
    genre: 'Terror, Sobrenatural',
    duration: '1h46min',
    rating: 4.4,
    votes: 21722,
    synopsis: 'Após os eventos devastadores de "Guerra Infinita", o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem mais uma vez para reverter as ações de Thanos e restaurar o equilíbrio do universo.'
  },
  {
    id: 10,
    title: 'Harry Potter',
    image: 'assets/images/harry.png',
    genre: 'Fantasia, Aventura, Magia',
    duration: '2h32min',
    rating: 4.9,
    votes: 100523,
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
  search(query: string): Observable<OperationResult> {
    try {
      const normalizedQuery = query.toLowerCase();

      const filtered = this.movies().filter(movie =>
        movie.title.toLowerCase().includes(normalizedQuery)

      );

      return of({ success: true, data: filtered, status: 200 });
    } catch (error) {
      return of({ success: false, error, status: 500 });
    }
  }

overrideMovies(newMovies: Movie[]): void {
  this.movies.set(newMovies);
}
}
