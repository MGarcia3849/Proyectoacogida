
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
  totalCarrito: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(carrito => {

      this.carrito = carrito ?? [];

    });
  }

  calcularTotal(): void {
    this.totalCarrito = this.carrito.reduce((sum, item) => sum + item.precio, 0);
  }

  vaciarCarrito(): void {
    if (confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
      this.cartService.vaciarCarrito();
    }
  }

  comprar(): void {
    if (this.carrito.length > 0) {
      const modalElement = document.getElementById('compraExitosaModal');
      if (modalElement) {
        // Inicializar y mostrar el modal
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
      this.cartService.vaciarCarrito();
    } else {
      alert('El carrito está vacío. Agrega productos antes de comprar.');
    }
  }

  formatPrecio(precio: number): string {
    return precio.toFixed(2);
  }
}
