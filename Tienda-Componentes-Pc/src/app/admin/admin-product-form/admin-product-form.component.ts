import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductosService, Producto } from '../../core/services/productos.service';

@Component({
  selector: 'app-admin-product-form',
  templateUrl: './admin-product-form.component.html',
  styleUrls: ['./admin-product-form.component.scss'],
  imports: [ CommonModule, ReactiveFormsModule ],
  standalone: true
})
export class AdminProductFormComponent implements OnInit {
  @Input() product: Producto = { id: '', nombre: '', categoria: '', precio: 0, precioOriginal: 0, imagen: '', enOferta: false, descripcion: '' };
  @Output() productSaved = new EventEmitter<void>();
  @Output() formCancelled = new EventEmitter<void>();

  productForm!: FormGroup;

  constructor(private fb: FormBuilder,  private productosService: ProductosService ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      nombre: [this.product.nombre, Validators.required],
      categoria: [this.product.categoria, Validators.required],
      precio: [this.product.precio, [Validators.required, Validators.min(0)]],
      precioOriginal: [this.product.precioOriginal, [Validators.min(0)]],
      imagen: [this.product.imagen],
      oferta: [this.product.enOferta],
      descripcion: [this.product.descripcion] 
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const newProduct: Producto = this.productForm.value;
      if (this.product.id) {
        newProduct.id = this.product.id; // Si hay un ID, es una edición
        this.productosService.updateProducto(newProduct).then(() => {
          this.productSaved.emit();
        });
      } else {
        this.productosService.addProducto(newProduct).then(() => {
          this.productSaved.emit();
        });
      }
    }
  }
  
  onCancel() {
    this.formCancelled.emit();
  }
}
