import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; 

import { Movie } from '../models/movies.model';
import { Cinema } from '../../cinemas/models/cinema.model';
import { Session } from '../../cinemas/models/session.model';

import { AbstractMovieService } from '../service/abstract-movie.service';
import { AbstractCinemaService } from '../../cinemas/service/abstract-cinema.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent {

  movie: Movie | undefined;
  cinemas: Signal<Cinema[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: AbstractMovieService,
    private cinemaService: AbstractCinemaService
  ) {
    this.cinemas = this.cinemaService.cinemas;

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      
      // dados do filme
      this.movie = this.movieService.movies().find(m => m.id === id);
      // carregar as sessões para este filme
      this.cinemaService.loadSessionsByMovie(id);
    }
  }

  // func caso clique numa sessão
  selectSession(session: Session): void {
    this.router.navigate(['/booking', session.id]);
  }

    getStarRatingArray(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    if (hasHalfStar) {
      stars.push('half');
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push('empty');
    }
    return stars;
  }
}