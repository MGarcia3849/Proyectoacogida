import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService, Producto } from '../../core/services/productos.service';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, NgFor],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private productosService = inject(ProductosService);
  productosEnOferta$: Observable<Producto[]> = this.productosService.getOfertasDestacadas();

  categorias = [
    { nombre: 'Ordenadores', slug: 'ordenadores', img: 'assets/categorias/ordenadores.jpg' },
    { nombre: 'Televisores', slug: 'televisores', img: 'assets/categorias/televisores.jpg' },
    { nombre: 'Gaming', slug: 'gaming', img: 'assets/categorias/gaming.jpg' },
    { nombre: 'Componentes', slug: 'componentes', img: 'assets/categorias/componentes.jpg' }
  ];
}
