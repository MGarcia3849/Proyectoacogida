import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductosService, Producto } from '../../core/services/productos.service';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {
  private productosService = inject(ProductosService);
  productos$: Observable<Producto[]> = this.productosService.getProductos();
}
