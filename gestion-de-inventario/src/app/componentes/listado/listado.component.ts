import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-listado',
  standalone: false,
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.scss'
})
export class ListadoComponent implements OnInit {
  // Almacén de productos
  productos: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // Llamada al servicio para obtener los productos
    this.dataService.getProductos().subscribe((productos) => {
      this.productos = productos;
    });
  }
}
