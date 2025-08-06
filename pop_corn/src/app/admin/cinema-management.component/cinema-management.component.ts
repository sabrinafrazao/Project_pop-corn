import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AbstractCinemaService } from '../../cinemas/service/abstract-cinema.service';
import { Cinema } from '../../cinemas/models/cinema.model';
import { Room } from '../../cinemas/models/room.model';

@Component({
  selector: 'app-cinema-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cinema-management.component.html',
  styleUrls: ['./cinema-management.component.scss']
})
export class CinemaManagementComponent {
  private cinemaService = inject(AbstractCinemaService);

  cinemas = this.cinemaService.cinemas;

  // Sinais e dados para os modais
  isRoomModalVisible = signal(false);
  isCinemaModalVisible = signal(false); // Sinal correto para o modal de cinemas
  modalMode = signal<'add' | 'edit'>('add');
  selectedCinemaForModal = signal<Cinema | null>(null);
  
  currentRoomForForm: Partial<Room> = {};
  newCinemaName: string = ''; // Propriedade que faltava

  constructor() {
    this.cinemaService.loadSessionsByMovie(1); 
  }

  // --- Funções para o Modal de Cinemas ---
  openAddCinemaModal(): void {
    this.newCinemaName = '';
    this.isCinemaModalVisible.set(true);
  }

  closeCinemaModal(): void {
    this.isCinemaModalVisible.set(false);
  }

  handleAddCinema(form: NgForm): void {
    if (form.invalid) return;
    this.cinemaService.addCinema({ name: this.newCinemaName }).subscribe(() => {
      this.cinemaService.loadSessionsByMovie(1);
      this.closeCinemaModal();
    });
  }

  deleteCinema(cinemaId: number): void {
    if (confirm('Tem certeza?')) {
      this.cinemaService.deleteCinema(cinemaId).subscribe(() => {
        this.cinemaService.loadSessionsByMovie(1);
      });
    }
  }

    // --- Funções para o Modal de Salas ---
  openAddRoomModal(cinema: Cinema): void {
    this.modalMode.set('add');
    this.currentRoomForForm = { name: '', type: '2D', sound: 'Dublado' };
    this.selectedCinemaForModal.set(cinema);
    this.isRoomModalVisible.set(true);
  }

  openEditRoomModal(cinema: Cinema, room: Room): void {
    this.modalMode.set('edit');
    this.currentRoomForForm = { ...room }; // Carrega dados da sala para o formulário
    this.selectedCinemaForModal.set(cinema);
    this.isRoomModalVisible.set(true);
  }

  closeRoomModal(): void {
    this.isRoomModalVisible.set(false);
    this.selectedCinemaForModal.set(null);
  }

  handleRoomSubmit(form: NgForm): void {
    const cinema = this.selectedCinemaForModal();
    if (form.invalid || !cinema) return;

    if (this.modalMode() === 'add') {
      this.cinemaService.addRoom(cinema.id, this.currentRoomForForm as Omit<Room, 'id' | 'sessions'>)
        .subscribe(() => this.closeRoomModal());
    } else {
      this.cinemaService.updateRoom(cinema.id, this.currentRoomForForm as Room)
        .subscribe(() => this.closeRoomModal());
    }
  }

  deleteRoom(cinemaId: number, roomId: number): void {
    if (confirm('Tem certeza que deseja excluir esta sala e todas as suas sessões?')) {
      this.cinemaService.deleteRoom(cinemaId, roomId).subscribe(result => {
        if (result.success) {
          console.log("Sala removida com sucesso!");
          // A atualização da UI já é reativa por causa dos signals, não precisa recarregar
        } else {
          alert("Erro ao remover a sala.");
        }
      });
    }
  }

}