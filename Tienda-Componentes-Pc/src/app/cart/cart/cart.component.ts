import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  carrito: any[] = [];

  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe(carrito => {
      this.carrito = carrito || [];
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
