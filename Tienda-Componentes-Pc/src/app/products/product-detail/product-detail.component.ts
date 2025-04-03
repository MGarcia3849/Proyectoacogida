import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Producto } from '../../core/services/productos.service';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);

  producto$: Observable<Producto>;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const ref = doc(this.firestore, `productos/${id}`);
    this.producto$ = docData(ref, { idField: 'id' }) as Observable<Producto>;
  }
}
