import { Component } from '@angular/core';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { Movie } from '../movies.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})


export class MovieListComponent {

  movies: Movie[] = [
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
];


}
