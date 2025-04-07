import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductosService, Producto } from '../../core/services/productos.service';
import { Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';

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

  producto$!: Observable<Producto | null>;
  private router = inject(Router);

  volverATienda() {
    this.router.navigate(['/']);
  }

  constructor() {
    this.producto$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.productosService.getProductoById(id) : of(null);
      })
    );
  }
}
