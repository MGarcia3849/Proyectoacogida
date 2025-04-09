import { Component, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductosService, Producto } from '../../core/services/productos.service';
import { Observable } from 'rxjs';

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
    { nombre: 'Portátiles', img: 'assets/categorias/portatiles.jpg' },
    { nombre: 'Ordenadores', img: 'assets/categorias/ordenadores.jpg' },
    { nombre: 'Monitores', img: 'assets/categorias/monitores.jpg' },
    { nombre: 'Gaming', img: 'assets/categorias/gaming.jpg' },
    { nombre: 'Componentes', img: 'assets/categorias/componentes.jpg' },
    { nombre: 'Accesorios', img: 'assets/categorias/accesorios.jpg' }
  ];
}
