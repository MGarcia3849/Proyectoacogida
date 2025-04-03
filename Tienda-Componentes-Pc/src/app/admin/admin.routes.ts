import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: ProductListComponent,
    title: 'Gestión de productos'
  },
  {
    path: 'nuevo',
    component: ProductFormComponent,
    title: 'Nuevo producto'
  },
  {
    path: 'editar/:id',
    component: ProductFormComponent,
    title: 'Editar producto'
  }
];
