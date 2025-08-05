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

  // ===== SINAL PARA A PRÉ-VISUALIZAÇÃO DA IMAGEM =====
  imagePreview = signal<string | null>(null);

  openAddModal(): void {
    this.modalMode.set('add');
    this.currentMovieForForm = {
      title: '',
      synopsis: '',
      genre: '',
      duration: '',
      rating: 0,
      image: '' // A imagem será tratada separadamente
    };
    this.imagePreview.set(null); // Limpa a pré-visualização anterior
    this.isModalVisible.set(true);
  }

  openEditModal(movie: Movie): void {
    this.modalMode.set('edit');
    this.currentMovieForForm = { ...movie };
    this.imagePreview.set(movie.image); // Mostra a imagem atual do filme
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
  }

  // ===== NOVA FUNÇÃO PARA LIDAR COM A SELEÇÃO DE FICHEIROS =====
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Usa o FileReader para ler o ficheiro como uma Data URL
      const reader = new FileReader();
      reader.onload = () => {
        // Define o sinal com o resultado para mostrar a pré-visualização
        this.imagePreview.set(reader.result as string);
        // Guarda a URL no objeto do formulário
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

    // A lógica de adicionar/atualizar já funciona, pois a URL da imagem
    // (neste caso, uma Data URL base64) já está em 'currentMovieForForm'
    const movieData = { ...form.value, image: this.currentMovieForForm.image };

    if (this.modalMode() === 'add') {
      this.movieService.add(movieData).subscribe(result => {
        if (result.success) {
          console.log('Filme adicionado com sucesso!');
          this.closeModal();
        }
      });
    } else {
      const updatedMovie = { ...this.currentMovieForForm, ...movieData } as Movie;
      this.movieService.update(updatedMovie).subscribe(result => {
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