// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // <-- AÑADIDO si faltaba
  imports: [RouterOutlet], // No necesita CommonModule porque no usa directivas comunes
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss' // Corregido de 'styleUrl' a 'styleUrls' si es un array
})
export class AppComponent {
  title = 'Tienda-Componentes-Pc';
}
