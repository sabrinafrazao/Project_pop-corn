import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {
  nome = '';
  email = '';
  senha = '';
  cpf = '';

  cadastrar() {
    console.log('Cadastro:', {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      cpf: this.cpf
    });
  }
}
