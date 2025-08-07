import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importar RouterModule
import { Movie } from '../models/movies.model';
import { AbstractMovieService } from '../service/abstract-movie.service';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Adicionar RouterModule
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  // Injeções de dependência
  private movieService = inject(AbstractMovieService);
  private router = inject(Router);

  // Estado do componente
  searchQuery = signal('');
  searchResults = signal<Movie[]>([]);
  isFocused = signal(false); // Para controlar a visibilidade do modal

  // Emite o termo de pesquisa para o componente pai
  @Output() search = new EventEmitter<string>();

  // Lógica de debounce para evitar chamadas excessivas à API
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300), // Espera 300ms após o utilizador parar de digitar
      distinctUntilChanged(), // Só emite se o valor for diferente do anterior
      tap(query => this.search.emit(query)), // Emite o termo para o movie-list
      switchMap(query => this.movieService.search(query)) // Faz a pesquisa
    ).subscribe(result => {
      if (result.success) {
        this.searchResults.set(result.data);
      } else {
        this.searchResults.set([]);
      }
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

  // Navega para o filme e limpa a pesquisa
  navigateToMovie(movieId: number): void {
    this.router.navigate(['/movie', movieId]);
    this.clearSearch();
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.isFocused.set(false);
  }
}
