import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AbstractMovieService } from '../../movies/service/abstract-movie.service';
import { AbstractCinemaService } from '../../cinemas/service/abstract-cinema.service';
import { AbstractAuthService } from '../../auth/services/abstract-auth.service';
import { Movie } from '../../movies/models/movies.model';
import { Cinema } from '../../cinemas/models/cinema.model';
import { Room } from '../../cinemas/models/room.model';
import { Session } from '../../cinemas/models/session.model';

@Component({
  selector: 'app-session-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-management.component.html',
  styleUrls: ['./session-management.component.scss']
})
export class SessionManagementComponent {
  authService = inject(AbstractAuthService);
  private movieService = inject(AbstractMovieService);
  private cinemaService = inject(AbstractCinemaService);

  isModalVisible = signal(false);
  selectedCinemaId = signal<number | null>(null);
  selectedMovieId = signal<number | null>(null);
  // CORREÇÃO: Este sinal agora armazena a estrutura de Cinema[] devolvida pelo serviço
  cinemasWithFilteredSessions = signal<Cinema[]>([]);
  
  selectedRoomId: number | null = null;
  sessionTime: string = '';

  allMovies = this.movieService.movies;
  allCinemas = this.cinemaService.cinemas;

  managedCinema = computed(() => {
    const cinemaId = this.selectedCinemaId();
    if (!cinemaId) return undefined;
    return this.allCinemas().find(c => c.id === cinemaId);
  });
  
  // Cinema filtrado que contém as sessões atuais para o filme selecionado
  filteredCinema = computed(() => {
    return this.cinemasWithFilteredSessions().find(c => c.id === this.managedCinema()?.id);
  });

  constructor() {
    if (!this.authService.isMaster()) {
      this.selectedCinemaId.set(this.authService.currentUser()?.cinemaId ?? null);
    }
  }

  onCinemaSelect(cinemaIdStr: string | null): void {
    const cinemaId = cinemaIdStr ? +cinemaIdStr : null;
    this.selectedCinemaId.set(cinemaId);
    this.onMovieSelect(null);
  }

  // CORREÇÃO: O parâmetro agora é 'any' para aceitar o evento, e depois é convertido
  onMovieSelect(movieIdValue: any | null): void {
    const movieId = movieIdValue ? +movieIdValue : null;
    this.selectedMovieId.set(movieId);

    if (!movieId) {
      this.cinemasWithFilteredSessions.set([]); // Limpa a lista de sessões
      return;
    }

    this.cinemaService.loadSessionsByMovie(movieId).subscribe(cinemas => {
      this.cinemasWithFilteredSessions.set(cinemas);
    });
  }

  getSessionsForRoom(room: Room): Session[] {
    // Procura a sala correspondente nos dados já filtrados
    const filteredRoom = this.filteredCinema()?.rooms.find(r => r.id === room.id);
    return filteredRoom?.sessions || [];
  }
  
  selectedMovie = computed(() => {
    const movieId = this.selectedMovieId();
    if (!movieId) return null;
    return this.allMovies().find(m => m.id === movieId);
  });

  selectedRoom = computed(() => {
    if (!this.selectedRoomId || !this.managedCinema()) return null;
    return this.managedCinema()?.rooms.find(r => r.id === this.selectedRoomId);
  });
  
  openAddSessionModal(room: Room): void {
    if (!this.selectedMovieId() || !this.managedCinema()) {
      alert('Por favor, selecione um cinema e um filme primeiro.');
      return;
    }
    this.selectedRoomId = room.id;
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    this.selectedRoomId = null;
    this.sessionTime = '';
  }

  handleAddSession(form: NgForm): void {
    const movieId = this.selectedMovieId();
    const cinema = this.managedCinema();
    if (form.invalid || !movieId || !this.selectedRoomId || !cinema) return;
    
    const sessionData: Omit<Session, 'id' | 'seatMap'> = { movieId, time: this.sessionTime };

    this.cinemaService.addSession(cinema.id, this.selectedRoomId, sessionData)
      .subscribe(() => this.onMovieSelect(movieId));
    this.closeModal();
  }

  deleteSession(sessionId: number, roomId: number): void {
    const cinema = this.managedCinema();
    const movieId = this.selectedMovieId();
    if (confirm('Tem certeza?') && cinema && movieId) {
      this.cinemaService.deleteSession(cinema.id, roomId, sessionId)
        .subscribe(() => this.onMovieSelect(movieId));
    }
  }
}