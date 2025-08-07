import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AbstractAuthService } from '../services/abstract-auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  authService = inject(AbstractAuthService);

  // Sinal para controlar o estado da UI: 'initial' ou 'submitted'
  viewState = signal<'initial' | 'submitted'>('initial');
  email: string = '';

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    this.authService.forgotPassword(this.email).subscribe(result => {
      if (result.success) {
        // Muda o estado para mostrar a mensagem de confirmação
        this.viewState.set('submitted');
      } else {
        alert('Ocorreu um erro. Por favor, tente novamente.');
      }
    });
  }
}