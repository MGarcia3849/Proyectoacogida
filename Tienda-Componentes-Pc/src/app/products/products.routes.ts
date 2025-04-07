import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    component: ProductListComponent,
    title: 'Listado de productos'
  },
  { path: 'producto/:id', component: ProductDetailComponent },
];
