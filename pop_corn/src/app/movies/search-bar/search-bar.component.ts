import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Movie } from '../models/movies.model';
import { AbstractMovieService } from '../service/abstract-movie.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

searchQuery = '';
searchResultList: Movie[] = [];

@Output() search = new EventEmitter<Movie[]>();

private service = inject(AbstractMovieService);
movies = this.service.movies;
trackById = (_: number, item: Movie) => item.id;

onSearchChange(query: string) {
  this.searchQuery = query;
  this.updateSearchResults(query);
}

updateSearchResults(query: string) {
  this.service.search(query).subscribe(result => {
    if (result.success) {
      this.searchResultList = result.data;
      this.search.emit(this.searchResultList);
    } else {
      this.searchResultList = [];
       this.search.emit([]);
    }
  });
}

searchResults(): Movie[] {
  return this.searchResultList;

}
}
