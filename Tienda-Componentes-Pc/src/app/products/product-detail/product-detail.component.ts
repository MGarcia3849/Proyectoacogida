import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductosService, Producto } from '../../core/services/productos.service';
import { Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

// Importar SweetAlert2
import Swal from 'sweetalert2';

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

      // Mostrar popup con SweetAlert2
      Swal.fire({
        title: '¡Producto agregado!',
        text: `${producto.nombre} ha sido agregado al carrito.`,
        imageUrl: producto.imagen,
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: producto.nombre,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
        backdrop: true
      });
    }
  }
}
