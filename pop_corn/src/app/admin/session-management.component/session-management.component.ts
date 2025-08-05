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
  private movieService = inject(AbstractMovieService);
  private cinemaService = inject(AbstractCinemaService);
  private authService = inject(AbstractAuthService);

  isModalVisible = signal(false);
  selectedMovieId = signal<number | null>(null);
  cinemaWithFilteredSessions = signal<Cinema | undefined>(undefined);
  
  selectedRoomId: number | null = null;
  sessionTime: string = '';

  allMovies = this.movieService.movies;
  allCinemas = this.cinemaService.cinemas;

  managedCinema = computed(() => {
    const adminCinemaId = this.authService.currentUser()?.cinemaId;
    if (!adminCinemaId) return undefined;
    return this.allCinemas().find(c => c.id === adminCinemaId);
  });
  
  constructor() {}

  onMovieSelect(movieId: number | null): void {
    if (!movieId) {
      this.selectedMovieId.set(null);
      this.cinemaWithFilteredSessions.set(undefined);
      return;
    }
    this.selectedMovieId.set(movieId);
    
    this.cinemaService.loadSessionsByMovie(movieId).subscribe(cinemasComSessoes => {
      const adminCinema = cinemasComSessoes.find(c => c.id === this.managedCinema()?.id);
      this.cinemaWithFilteredSessions.set(adminCinema);
    });
  }

  getSessionsForRoom(room: Room): Session[] {
    const filteredRoom = this.cinemaWithFilteredSessions()?.rooms.find(r => r.id === room.id);
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
    if (!this.selectedMovieId()) {
      alert('Por favor, selecione um filme primeiro.');
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
    if (form.invalid || !movieId || !this.selectedRoomId || !cinema) {
      return;
    }
    
    const sessionData: Omit<Session, 'id' | 'seatMap'> = {
        movieId: movieId,
        time: this.sessionTime
    };

    this.cinemaService.addSession(cinema.id, this.selectedRoomId, sessionData)
      .subscribe(result => {
        if (result.success) {
          console.log('Sessão adicionada:', result.data);
          this.onMovieSelect(movieId);
          this.closeModal();
        }
      });
  }

  deleteSession(sessionId: number, roomId: number): void {
    const cinema = this.managedCinema();
    const movieId = this.selectedMovieId();
    if (confirm('Tem certeza que deseja excluir esta sessão?') && cinema && movieId) {
      this.cinemaService.deleteSession(cinema.id, roomId, sessionId)
        .subscribe(result => {
          if (result.success) {
            console.log('Sessão removida.');
            this.onMovieSelect(movieId);
          }
        });
    }
  }
}