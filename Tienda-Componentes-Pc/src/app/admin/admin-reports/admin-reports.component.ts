import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  Firestore,
  collection,
  collectionData,
  query,
  count,
  AggregateQuerySnapshot,
  CollectionReference,
  AggregateField,
  getAggregateFromServer,
  DocumentData
} from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface Producto {
  categoria: string;
  id: string;
}

interface Cliente {}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminReportsComponent implements OnInit {
  totalProductos$: Observable<number | null> = new Observable<number | null>();
  totalUsuarios$: Observable<number | null> = new Observable<number | null>();
  productosPorCategoria$: Observable<{ [categoria: string]: number } | null> = of(null);
  categorias$: Observable<string[]> = new Observable<string[]>();

  private firestore = inject(Firestore);
  private productosCollection = collection(this.firestore, 'productos') as CollectionReference<Producto>;
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cargarTotalProductos();
    this.cargarTotalUsuarios();
    this.cargarProductosPorCategoria();
  }

  cargarTotalProductos() {
    const countQuery = query(this.productosCollection);
    this.totalProductos$ = from(getAggregateFromServer(countQuery, { total: count() })).pipe(
      map((snapshot: AggregateQuerySnapshot<{ total: AggregateField<number> }>) => snapshot.data().total)
    );
  }

  cargarTotalUsuarios() {
    const clientesRef = collection(this.firestore, 'clientes') as CollectionReference<Cliente>;
    const countQuery = query(clientesRef);
    this.totalUsuarios$ = from(getAggregateFromServer(countQuery, { total: count() })).pipe(
      map((snapshot: AggregateQuerySnapshot<{ total: AggregateField<number> }, Cliente, DocumentData>) => snapshot.data().total)
    );
  }

  cargarProductosPorCategoria() {
    this.productosPorCategoria$ = collectionData<Producto>(this.productosCollection, { idField: 'id' })
      .pipe(
        map((productos: Producto[]) => {
          const counts: { [categoria: string]: number } = {};
          productos.forEach(producto => {
            counts[producto.categoria] = (counts[producto.categoria] || 0) + 1;
          });
          return counts;
        })
      );
  }

  cargarCategorias() {
    this.categorias$ = this.productosPorCategoria$.pipe(
      map(categorias => {
        const keys = Object.keys(categorias || {});
        this.cdr.detectChanges();
        return keys;
      })
    );
  }
}