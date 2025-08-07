import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AbstractAuthService } from '../services/abstract-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authService = inject(AbstractAuthService);
  router = inject(Router);

  // Objeto para guardar os dados do formulário
  loginData = {
    email: '',
    password: ''
  };

  constructor() {
    // Se o utilizador já estiver logado, redireciona-o para a página inicial
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  // Função chamada quando o formulário é submetido
  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    // Chama o método de login do serviço com os dados do formulário
    this.authService.login(this.loginData.email, this.loginData.password);
  }
}