import { Component, Signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; 

import { Movie } from '../models/movies.model';
import { Cinema } from '../../cinemas/models/cinema.model';
import { Session } from '../../cinemas/models/session.model';

import { AbstractMovieService } from '../service/abstract-movie.service';
import { AbstractCinemaService } from '../../cinemas/service/abstract-cinema.service';
import { AbstractAuthService } from '../../auth/services/abstract-auth.service';
import { AbstractOrderService } from '../../order/services/abstract-order.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent {
  // Injeção de dependências
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private movieService = inject(AbstractMovieService);
  private cinemaService = inject(AbstractCinemaService);
  private authService = inject(AbstractAuthService);
  private orderService = inject(AbstractOrderService);

  movie: Movie | undefined;
  cinemas: Signal<Cinema[]>;

  constructor() {
    this.cinemas = this.cinemaService.cinemas;

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      
      this.movie = this.movieService.movies().find(m => m.id === id);
      if (this.movie) {
        this.cinemaService.loadSessionsByMovie(id);
      }
    }
  }

  selectSession(session: Session, cinemaName: string): void {
    // Primeiro, verifica se o utilizador está logado
    if (!this.authService.isAuthenticated()) {
      // Se não estiver, redireciona para o login e guarda a página atual para voltar depois
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    // Se estiver logado, guarda o contexto do pedido e navega para a reserva
    if (this.movie) {
      this.orderService.setOrderContext(this.movie, session, cinemaName);
      this.router.navigate(['/booking', session.id]);
    } else {
      console.error("Filme não encontrado, não é possível prosseguir para a reserva.");
    }
  }

  goBack(): void {
    this.location.back();
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
