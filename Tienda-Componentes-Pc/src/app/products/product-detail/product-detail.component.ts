import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductosService, Producto } from '../../core/services/productos.service';
import { Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productosService = inject(ProductosService);
  private cartService = inject(CartService);
  private router = inject(Router);

  producto$!: Observable<Producto | null>;

  constructor() {
    this.producto$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.productosService.getProductoById(id) : of(null);
      })
    );
  }

  volverATienda() {
    this.router.navigate(['/']);
  }

  agregarAlCarrito(producto: Producto | null) {
    if (producto) {
      this.cartService.agregarProducto(producto);
      alert(`${producto.nombre} agregado al carrito!`);
    }
  }
}