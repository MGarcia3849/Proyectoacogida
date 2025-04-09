import { Component, inject } from '@angular/core'; // Asegúrate que inject esté importado
import { CommonModule } from '@angular/common'; // Necesario para *ngIf, *ngFor, | async
import { RouterModule } from '@angular/router'; // Necesario para routerLink
import { ProductosService, Producto } from '../../core/services/productos.service'; // Importa el servicio y la interfaz
import { Observable } from 'rxjs'; // Importa Observable

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, // Provee *ngIf, *ngFor, | async
    RouterModule  // Provee routerLink
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  // ** 1. Inyecta el servicio ProductosService **
  private productosService = inject(ProductosService);

  // ** 2. Define la propiedad que faltaba **
  productosEnOferta$: Observable<Producto[]> = this.productosService.getOfertasDestacadas();

  // ** 3. Mantén tu array 'categorias' con las rutas corregidas **
  categorias = [
    { nombre: 'Portátiles', img: 'assets/img/portatiles.jpg' },
    { nombre: 'Ordenadores', img: 'assets/img/ordenadores.jpg' },
    { nombre: 'Monitores', img: 'assets/img/monitores.jpg' },
    { nombre: 'Gaming', img: 'assets/img/gaming.jpg' },
    { nombre: 'Componentes', img: 'assets/img/componentes.jpg' },
    { nombre: 'Accesorios', img: 'assets/img/accesorios.jpg' }
  ];

  // El constructor puede estar vacío si usas inject() para los servicios
  constructor() {}

  // ngOnInit también puede estar vacío si la inicialización se hace arriba
  ngOnInit(): void {}
}
