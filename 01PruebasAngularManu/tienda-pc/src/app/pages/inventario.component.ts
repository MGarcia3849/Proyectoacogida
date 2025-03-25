import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioService, Producto } from '../services/inventario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  form!: FormGroup;
  imagenFile: File | null = null;
  editando: string | null = null;
  rol: string = '';

  constructor(
    private inventario: InventarioService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol') || 'user';

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required]
    });

    this.inventario.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  seleccionarImagen(event: any) {
    this.imagenFile = event.target.files[0];
  }

  async guardar() {
    if (this.form.invalid) return;
    const producto: Producto = this.form.value;

    try {
      if (this.editando) {
        await this.inventario.updateProducto(this.editando, producto, this.imagenFile);
      } else {
        await this.inventario.addProducto(producto, this.imagenFile);
      }
      this.cancelar();
    } catch (err) {
      console.error('❌ Error al guardar producto:', err);
    }
  }

  editar(p: Producto) {
    this.editando = p.id!;
    this.form.patchValue({
      nombre: p.nombre,
      marca: p.marca,
      modelo: p.modelo
    });
    this.imagenFile = null;
  }

  eliminar(id: string) {
    if (confirm('¿Eliminar este producto?')) {
      this.inventario.deleteProducto(id);
    }
  }

  cancelar() {
    this.editando = null;
    this.form.reset();
    this.imagenFile = null;
  }

  volver() {
    this.router.navigate(['/inicio']);
  }
}
