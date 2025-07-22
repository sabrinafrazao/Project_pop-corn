import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // APENAS RouterOutlet deve estar aqui
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'pop_corn';
}