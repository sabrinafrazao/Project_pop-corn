import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { Movie } from '../models/movies.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { AbstractMovieService } from '../service/abstract-movie.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})


export class MovieListComponent implements OnInit {
  // pegamos a referência do Signal do serviço
  movies: Signal<Movie[]>;

  constructor(private movieService: AbstractMovieService) {
    this.movies = this.movieService.movies;
  }

  ngOnInit(): void {
    // pede uma atualização inicial
    this.movieService.refresh();
  }
}


