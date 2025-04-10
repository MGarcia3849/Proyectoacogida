// src/app/cart/cart/cart.component.ts
import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule, NgIf, NgFor } from '@angular/common'; // CommonModule ya incluye NgIf y NgFor

@Component({
  selector: 'app-cart',
  standalone: true, // <-- AÑADIDO
  imports: [CommonModule], // Importar CommonModule (ya no es necesario NgIf/NgFor por separado)
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  // ... (resto del código sin cambios) ...
  carrito: any[] = [];

  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe(carrito => {
      // Asegurarse de que siempre sea un array, incluso si el BehaviorSubject emite null inicialmente
      this.carrito = carrito ?? [];
    });
  }

  vaciarCarrito() {
    this.cartService.vaciarCarrito();
  }

  comprar() {
    if (this.carrito.length > 0) {
      alert('¡Compra realizada con éxito! Gracias por tu compra.');
      this.cartService.vaciarCarrito();
    } else {
      alert('El carrito está vacío. Agrega productos antes de comprar.');
    }
  }
}
