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
    ageRating: '18',
    synopsis: 'John Wick enfrenta os líderes do submundo em uma batalha pela liberdade, com lutas intensas e muita ação do início ao fim.'
  },
  {
    id: 2,
    title: 'Vingadores: Guerra Infinita',
    image: 'assets/images/avengers.png',
    genre: 'Ação, Ficção, Super-herói',
    duration: '2h40min',
    rating: 4.8,
    ageRating: '12',
    synopsis: 'Os Vingadores unem forças com os Guardiões da Galáxia para impedir que Thanos reúna as Joias do Infinito e destrua metade do universo.'
  },
  {
    id: 3,
    title: 'É Assim Que Acaba',
    image: 'assets/images/queAcaba.png',
    genre: 'Romance, Drama',
    duration: '2h03min',
    rating: 4.6,
    ageRating: '16',
    synopsis: 'Baseado no best-seller de Colleen Hoover, a história acompanha Lily Bloom enquanto ela lida com relacionamentos marcados por amor e trauma.'
  },
  {
    id: 4,
    title: 'Deadpool & Wolverine',
    image: 'assets/images/deadpool.png',
    genre: 'Ação, Comédia, Super-herói',
    duration: '2h15min',
    rating: 4.9,
    ageRating: '18',
    synopsis: 'Deadpool retorna em uma aventura cheia de humor ácido e violência exagerada, agora ao lado do icônico Wolverine.'
  },
  {
    id: 5,
    title: 'Batman vs Superman',
    image: 'assets/images/batman.png',
    genre: 'Ação, Super-herói, Drama',
    duration: '2h31min',
    rating: 4.0,
    ageRating: '14',
    synopsis: 'Temendo as ações do Superman, Batman enfrenta o Homem de Aço enquanto uma nova ameaça se forma nas sombras.'
  },
  {
    id: 6,
    title: 'Coringa',
    image: 'assets/images/coringa.png',
    genre: 'Drama, Thriller, Psicológico',
    duration: '2h02min',
    rating: 4.6,
    ageRating: '18',
    synopsis: 'Arthur Fleck, um comediante fracassado, mergulha em uma espiral de loucura e violência que o transforma no temido Coringa.'
  },
  {
    id: 7,
    title: 'Avatar 2',
    image: 'assets/images/avatar.png',
    genre: 'Ficção, Aventura, Fantasia',
    duration: '3h12min',
    rating: 4.7,
    ageRating: '12',
    synopsis: 'Jake Sully e Neytiri enfrentam novas ameaças enquanto protegem sua família e o planeta Pandora em uma aventura visualmente deslumbrante.'
  },
  {
    id: 8,
    title: 'Shang-Chi',
    image: 'assets/images/shang.png',
    genre: 'Ação, Super-herói, Aventura',
    duration: '2h12min',
    rating: 4.5,
    ageRating: '12',
    synopsis: 'Shang-Chi precisa confrontar seu passado e enfrentar o pai, líder de uma poderosa organização criminosa, usando suas habilidades em artes marciais.'
  },
  {
    id: 9,
    title: 'Annabelle 3',
    image: 'assets/images/anabelle.png',
    genre: 'Terror, Sobrenatural',
    duration: '1h46min',
    rating: 4.4,
    ageRating: '16',
    synopsis: 'A boneca amaldiçoada Annabelle volta a causar terror quando é trancada em um cômodo pelos demonologistas Warren, mas acorda forças malignas.'
  },
  {
    id: 10,
    title: 'Harry Potter',
    image: 'assets/images/harry.png',
    genre: 'Fantasia, Aventura, Magia',
    duration: '2h32min',
    rating: 4.9,
    ageRating: '10',
    synopsis: 'Harry descobre que é um bruxo e parte para Hogwarts, onde enfrentará desafios mágicos e inimigos perigosos enquanto busca seu destino.'
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
