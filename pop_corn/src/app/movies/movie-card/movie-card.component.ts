import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../models/movies.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {

   @Input() movie!: Movie;

}
