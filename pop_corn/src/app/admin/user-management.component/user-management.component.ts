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
  private authService = inject(AbstractAuthService);
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
    // Garante que a lista de cinemas está disponível no serviço
    if (this.allCinemas().length === 0) {
      this.cinemaService.loadSessionsByMovie(1); // Carrega a lista base de cinemas
    }
  }

  onCinemaChange(adminUser: User, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const cinemaId = selectElement.value === 'none' ? undefined : +selectElement.value;
    
    const updatedUser = { ...adminUser, cinemaId };

    this.authService.updateUser(updatedUser).subscribe(result => {
      if (result.success) {
        console.log(`Cinema do admin ${adminUser.name} atualizado.`);
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