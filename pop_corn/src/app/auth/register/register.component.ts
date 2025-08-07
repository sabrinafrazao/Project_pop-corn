import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AbstractAuthService } from '../services/abstract-auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  authService = inject(AbstractAuthService);
  router = inject(Router);

  // Objeto para guardar os dados do formulário de registo
  registerData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor() {
    // Redireciona se o utilizador já estiver logado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  // Função chamada ao submeter o formulário
  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('As senhas não correspondem.');
      return;
    }

    // Prepara os dados do novo utilizador para enviar ao serviço
    const newUser: Omit<User, 'id'> = {
      name: this.registerData.name,
      email: this.registerData.email,
      password: this.registerData.password,
      role: 'USER', // Novos registos são sempre do tipo 'USER'
      avatarUrl: `https://placehold.co/100x100/FFFFFF/000000?text=${this.registerData.name.charAt(0).toUpperCase()}`
    };

    this.authService.addUser(newUser).subscribe(result => {
      if (result.success) {
        alert('Conta criada com sucesso! Faça o login para continuar.');
        this.router.navigate(['/login']);
      } else {
        alert('Ocorreu um erro ao criar a sua conta.');
      }
    });
  }
}