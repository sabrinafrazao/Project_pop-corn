import { Component, inject, signal, WritableSignal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../models/movies.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AbstractMovieService } from '../service/abstract-movie.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, SearchBarComponent],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent {
  private movieService = inject(AbstractMovieService);
  
  // Sinal para guardar o termo da pesquisa atual
  private searchQuery = signal<string>('');
  
  // Sinal que guarda a lista completa de filmes do serviço
  private allMovies = this.movieService.movies;

  // Sinal COMPUTADO: a lista de filmes a ser exibida é recalculada
  // automaticamente sempre que 'allMovies' ou 'searchQuery' mudarem.
  movies = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      return this.allMovies(); // Se não houver pesquisa, retorna todos os filmes
    }
    // Filtra os filmes com base no termo da pesquisa
    return this.allMovies().filter(movie => 
      movie.title.toLowerCase().includes(query)
    );
  });

  // Este método agora simplesmente atualiza o sinal da pesquisa.
  // A mágica acontece no 'computed' signal acima.
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }
}
