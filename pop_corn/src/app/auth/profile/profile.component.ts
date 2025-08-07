import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AbstractAuthService } from '../services/abstract-auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  private authService = inject(AbstractAuthService);

  // Sinais para controlar a visibilidade dos diálogos
  isProfileDialogVisible = signal(false);
  isPasswordDialogVisible = signal(false);

  // Sinais e dados para os formulários
  editingUser = signal<Partial<User>>({});
  imagePreview = signal<string | null>(this.authService.currentUser()?.avatarUrl || null);
  passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
  
  currentUser = this.authService.currentUser;

  // --- Funções do Diálogo de Perfil ---
  openProfileDialog(): void {
    this.editingUser.set({ ...this.currentUser() });
    this.imagePreview.set(this.currentUser()?.avatarUrl || null);
    this.isProfileDialogVisible.set(true);
  }

  closeProfileDialog(): void {
    this.isProfileDialogVisible.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
        this.editingUser.update(user => ({ ...user, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  handleProfileUpdate(form: NgForm): void {
    if (form.invalid) return;
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    const updatedData: User = {
      ...currentUser,
      name: this.editingUser().name!,
      avatarUrl: this.imagePreview() || currentUser.avatarUrl,
    };

    this.authService.updateUser(updatedData).subscribe(result => {
      if (result.success) {
        alert('Perfil atualizado com sucesso!');
        this.closeProfileDialog();
      } else {
        alert('Ocorreu um erro ao atualizar o perfil.');
      }
    });
  }

  // --- Funções do Diálogo de Senha ---
  openPasswordDialog(): void {
    this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    this.isPasswordDialogVisible.set(true);
  }
  
  closePasswordDialog(): void {
    this.isPasswordDialogVisible.set(false);
  }

  handlePasswordUpdate(form: NgForm): void {
    if (form.invalid) return;
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('A nova senha e a confirmação não correspondem.');
      return;
    }
    console.log("A tentar alterar a senha...", this.passwordData);
    alert('Senha alterada com sucesso! (Simulado)');
    this.closePasswordDialog();
  }
}