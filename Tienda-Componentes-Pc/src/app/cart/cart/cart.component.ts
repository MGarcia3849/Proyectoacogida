import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <h2 class="mb-4">🛒 Tu Cesta</h2>
      <p>Aquí aparecerán los productos que añadas a la cesta.</p>
      <!-- En el futuro añadiremos la lógica con Firebase y pasarela de pago -->
    </div>
  `
})
export class CartComponent {}
