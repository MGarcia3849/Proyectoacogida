// src/app/admin/admin-product-form/admin-product-form.component.ts
import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core'; // <-- Importar Input, Output, EventEmitter
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // No necesitamos ActivatedRoute si usamos @Input
import { CommonModule } from '@angular/common';
import imageCompression from 'browser-image-compression';
import { ProductosService, Producto } from '../../core/services/productos.service';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-product-form.component.html',
  styleUrls: ['./admin-product-form.component.scss']
})
export class AdminProductFormComponent implements OnInit {

  // --- INPUT PROPERTY ---
  // Acepta el producto que viene del componente padre (AdminProductListComponent)
  @Input() product: Producto | null = null;

  // --- OUTPUT EVENTS ---
  // Emite un evento cuando el producto se guarda correctamente
  @Output() productSaved = new EventEmitter<void>();
  // Emite un evento cuando el usuario cancela la edición/creación
  @Output() formCancelled = new EventEmitter<void>();


  // Inyección de dependencias
  private fb = inject(FormBuilder);
  // private route = inject(ActivatedRoute); // Ya no es necesario si usamos @Input
  private router = inject(Router); // Puede seguir siendo útil para navegación
  private productosService = inject(ProductosService);

  // Propiedades del componente
  productForm!: FormGroup;
  isEditMode = false;      // Se determinará por la presencia de @Input product
  productId: string | null = null; // Se obtendrá del @Input product
  imageBase64Preview: string | null = null;
  processedImageFile: string | null = null;
  imageError: string | null = null;
  isUploading = false;

  ngOnInit(): void {
    // Determina si estamos editando BASADO EN EL @INPUT
    this.isEditMode = !!this.product; // Si this.product tiene valor, estamos editando
    this.productId = this.product?.id ?? null; // Obtiene el ID del producto de entrada, si existe

    // Define la estructura del formulario
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
      enOferta: [false],
      precioOriginal: [null, Validators.min(0.01)],
      stock: [0, [Validators.required, Validators.min(0)]]
    });

    // Si estamos en modo edición (porque this.product existe)...
    if (this.isEditMode && this.product) {
      // ...llena el formulario con los datos del producto recibido por @Input
      this.productForm.patchValue(this.product);
      // Carga previsualización si existe imagen guardada
      if (this.product.imagenDataUrl) {
        this.imageBase64Preview = this.product.imagenDataUrl;
        this.processedImageFile = this.product.imagenDataUrl;
      }
    }
    // Si no, el formulario se queda con los valores iniciales (para crear uno nuevo)
  }

  // El método onFileSelected se mantiene igual que en la versión anterior...
  async onFileSelected(event: Event): Promise<void> {
    this.imageError = null;
    this.isUploading = true;

    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];

      if (!file.type.startsWith('image/')) {
        this.imageError = 'Por favor, selecciona un archivo de imagen válido.';
        this.isUploading = false;
        element.value = '';
        return;
      }

      console.log(`Tamaño original: ${(file.size / 1024).toFixed(2)} KB`);
      const options = { maxSizeMB: 0.2, maxWidthOrHeight: 1024, useWebWorker: true };

      try {
        const compressedFile = await imageCompression(file, options);
        console.log(`Tamaño comprimido: ${(compressedFile.size / 1024).toFixed(2)} KB`);

        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => {
          const result = reader.result as string;
          this.imageBase64Preview = result;
          this.processedImageFile = result;
          this.imageError = null;
          this.isUploading = false;
        };
        reader.onerror = (error) => {
          console.error('Error al leer el archivo comprimido:', error);
          this.imageError = 'Error al procesar la imagen después de comprimir.';
          this.isUploading = false;
        };
      } catch (error) {
        console.error('Error al comprimir la imagen:', error);
        this.imageError = 'Error al comprimir la imagen.';
        if (error instanceof Error && error.message.includes('target size')) {
          this.imageError = `No se pudo comprimir la imagen por debajo de ${options.maxSizeMB}MB.`;
        }
        this.isUploading = false;
        element.value = '';
      }
    } else {
      this.isUploading = false;
    }
  }


  // El método onSubmit se mantiene muy similar, pero emite evento al finalizar
  onSubmit(): void {
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid) {
      console.warn('Formulario inválido.');
      return;
    }
    if (!this.processedImageFile) {
      this.imageError = 'Se requiere una imagen para el producto.';
      return;
    } else {
      this.imageError = null;
    }

    const productoData: Partial<Producto> = {
      ...this.productForm.value,
      imagenDataUrl: this.processedImageFile
    };

    if (productoData.enOferta && (!productoData.precioOriginal || productoData.precioOriginal <= productoData.precio!)) {
        alert('Si el producto está en oferta, el precio original debe ser mayor que el precio de oferta.');
        return;
    }
    if (!productoData.enOferta) {
        delete productoData.precioOriginal;
    }

    this.isUploading = true;
    let operation: Promise<any>;

    if (this.isEditMode && this.productId) {
      operation = this.productosService.updateProducto(this.productId, productoData);
    } else {
      operation = this.productosService.addProducto(productoData as Omit<Producto, 'id'>);
    }

    operation
      .then((result) => {
        console.log(this.isEditMode ? 'Producto actualizado' : `Producto creado${result?.id ? ', ID: ' + result.id : ''}`);
        this.productSaved.emit(); // <-- EMITE EVENTO DE ÉXITO
        // Ya no navegamos desde aquí, el padre decidirá qué hacer (ocultar el form)
        // this.router.navigate(['/admin/products']);
      })
      .catch(err => {
        console.error(this.isEditMode ? "Error al actualizar:" : "Error al crear:", err);
        alert(`Error al ${this.isEditMode ? 'actualizar' : 'crear'} el producto.`);
      })
      .finally(() => {
        this.isUploading = false;
      });
  }

  // Método para emitir el evento de cancelación
  cancel(): void {
    this.formCancelled.emit(); // <-- EMITE EVENTO DE CANCELACIÓN
  }
}
