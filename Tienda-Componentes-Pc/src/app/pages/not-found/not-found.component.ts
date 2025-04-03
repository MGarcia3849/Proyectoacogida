import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-not-found',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container text-center mt-5">
      <h1 class="display-1 text-danger">404</h1>
      <h2 class="mb-4">Página no encontrada</h2>
      <p>La ruta que estás buscando no existe.</p>
      <a routerLink="/" class="btn btn-outline-primary mt-3">Volver al inicio</a>
    </div>
  `
})
export class NotFoundComponent {}
