import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../models/movies.model';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {

   @Input() movie!: Movie;

   // ===== FUNÇÃO QUE FALTAVA ADICIONADA AQUI =====
   getAgeRatingClass(ageRating: string): string {
     if (!ageRating) return 'age-l'; // Padrão
     const age = parseInt(ageRating, 10);
     if (ageRating.toUpperCase() === 'L') return 'age-l';
     if (age < 12) return 'age-10';
     if (age < 14) return 'age-12';
     if (age < 16) return 'age-14';
     if (age < 18) return 'age-16';
     return 'age-18';
   }
}