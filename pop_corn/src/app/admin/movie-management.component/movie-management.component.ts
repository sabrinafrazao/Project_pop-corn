import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AbstractMovieService } from '../../movies/service/abstract-movie.service';
import { Movie } from '../../movies/models/movies.model';

@Component({
  selector: 'app-movie-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-management.component.html',
  styleUrls: ['./movie-management.component.scss']
})
export class MovieManagementComponent {
  private movieService = inject(AbstractMovieService);

  isModalVisible = signal(false);
  modalMode = signal<'add' | 'edit'>('add');
  
  currentMovieForForm: Partial<Movie> = {};
  movies = this.movieService.movies;
  imagePreview = signal<string | null>(null);

  // ===== LISTA DE CLASSIFICAÇÕES PERMITIDAS =====
  ageRatings: string[] = ['L', '10', '12', '14', '16', '18'];

  openAddModal(): void {
    this.modalMode.set('add');
    this.currentMovieForForm = {
      title: '',
      synopsis: '',
      genre: '',
      duration: '',
      rating: 0,
      image: '',
      ageRating: 'L', // Padrão 'Livre'
    };
    this.imagePreview.set(null);
    this.isModalVisible.set(true);
  }

  openEditModal(movie: Movie): void {
    this.modalMode.set('edit');
    this.currentMovieForForm = { ...movie };
    this.imagePreview.set(movie.image);
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
        this.currentMovieForForm.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  handleSubmit(form: NgForm): void {
    if (form.invalid || !this.currentMovieForForm.image) {
      alert('Por favor, preencha todos os campos e selecione uma imagem.');
      return;
    }

    const movieData = { ...this.currentMovieForForm, ...form.value };

    if (this.modalMode() === 'add') {
      this.movieService.add(movieData as Omit<Movie, 'id'>).subscribe(result => {
        if (result.success) {
          console.log('Filme adicionado com sucesso!');
          this.closeModal();
        }
      });
    } else {
      this.movieService.update(movieData as Movie).subscribe(result => {
        if (result.success) {
          console.log('Filme atualizado com sucesso!');
          this.closeModal();
        }
      });
    }
  }

  deleteMovie(movieId: number): void {
    if (confirm('Tem certeza que deseja excluir este filme?')) {
      this.movieService.remove(movieId).subscribe();
    }
  }
}