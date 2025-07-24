import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Movie } from '../models/movies.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { AbstractMovieService } from '../service/abstract-movie.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, SearchBarComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})


export class MovieListComponent implements OnInit {

   movies: Signal<Movie[]>;

  constructor(private movieService: AbstractMovieService) {
    this.movies = this.movieService.movies;
  }

  ngOnInit(): void {
    // pede uma atualização inicial
    this.movieService.refresh();
  }

  onSearchChange(result: Movie[]) {
  this.movieService.overrideMovies(result);
}
}


