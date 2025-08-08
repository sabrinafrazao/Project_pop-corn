import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AbstractAuthService } from '../../auth/services/abstract-auth.service';
import { AbstractCinemaService } from '../../cinemas/service/abstract-cinema.service';
import { User } from '../../auth/models/user.model';
import { Cinema } from '../../cinemas/models/cinema.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  authService = inject(AbstractAuthService);
  private cinemaService = inject(AbstractCinemaService);

  allUsers = this.authService.allUsers;
  allCinemas = this.cinemaService.cinemas;

  // Filtra para mostrar apenas utilizadores ADMIN para gestão
  adminUsers = computed(() => this.allUsers().filter(u => u.role === 'ADMIN'));
  
  isUserModalVisible = signal(false);
  newUser: Omit<User, 'id'> = {
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
    avatarUrl: 'https://placehold.co/100x100/4A5568/FFFFFF?text=A'
  };

  constructor() {
    this.authService.loadAllUsers();
    if (this.allCinemas().length === 0) {
      this.cinemaService.loadSessionsByMovie(1);
    }
  }

  onCinemaChange(adminUser: User, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    // --- CORREÇÃO AQUI ---
    // Trocamos 'undefined' por 'null' para garantir que o valor seja enviado para a API
    const cinemaId = selectElement.value === 'none' ? null : +selectElement.value;
    // ---------------------
    
    const updatedUser = { ...adminUser, cinemaId };

    this.authService.updateUser(updatedUser).subscribe(result => {
      if (result.success) {
        console.log(`Cinema do admin ${adminUser.name} atualizado.`);
      } else {
        console.error("Falha ao atualizar o cinema do admin.");
      }
    });
  }

  openAddUserModal(): void {
    this.newUser = { name: '', email: '', password: '', role: 'ADMIN', avatarUrl: 'https://placehold.co/100x100/4A5568/FFFFFF?text=A' };
    this.isUserModalVisible.set(true);
  }

  closeUserModal(): void {
    this.isUserModalVisible.set(false);
  }

  handleAddUser(form: NgForm): void {
    if (form.invalid) return;
    this.authService.addUser(this.newUser).subscribe(() => {
      this.closeUserModal();
    });
  }
}
