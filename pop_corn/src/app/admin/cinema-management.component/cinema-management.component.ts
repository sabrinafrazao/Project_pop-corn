import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AbstractCinemaService } from '../../cinemas/service/abstract-cinema.service';
import { Cinema } from '../../cinemas/models/cinema.model';

@Component({
  selector: 'app-cinema-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cinema-management.component.html',
  styleUrls: ['./cinema-management.component.scss']
})
export class CinemaManagementComponent {
  private cinemaService = inject(AbstractCinemaService);

  isCinemaModalVisible = signal(false);
  newCinemaName = '';

  // Carrega todos os cinemas para gerenciamento
  cinemas = this.cinemaService.cinemas;

  constructor() {
    this.cinemaService.loadSessionsByMovie(1); // Carrega dados iniciais
  }

  openAddCinemaModal(): void {
    this.newCinemaName = '';
    this.isCinemaModalVisible.set(true);
  }

  closeCinemaModal(): void {
    this.isCinemaModalVisible.set(false);
  }

  handleAddCinema(form: NgForm): void {
    if (form.invalid) return;

    this.cinemaService.addCinema({ name: this.newCinemaName }).subscribe(result => {
      if (result.success) {
        console.log("Cinema adicionado com sucesso!", result.data);
        this.cinemaService.loadSessionsByMovie(1); // Recarrega a lista
        this.closeCinemaModal();
      }
    });
  }

  deleteCinema(cinemaId: number): void {
    if (confirm('Tem certeza que deseja excluir este cinema e todas as suas salas e sessões?')) {
      this.cinemaService.deleteCinema(cinemaId).subscribe(result => {
        if (result.success) {
          console.log("Cinema removido com sucesso!");
          this.cinemaService.loadSessionsByMovie(1);
        }
      });
    }
  }
}