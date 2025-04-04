import { Routes } from '@angular/router';
import { AdminProductListComponent } from './admin-product-list/admin-product-list.component';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';
import { AdminComponent } from './admin.component';

export const ADMIN_ROUTES: Routes = [
  { path: '',
    component: AdminComponent,
    title: 'Admin de productos'
  },
  {
    path: 'lista',
    component: AdminProductListComponent,
    title: 'Gestión de productos'
  },
  {
    path: 'nuevo',
    component: AdminProductFormComponent,
    title: 'Nuevo producto'
  },
  {
    path: 'editar/:id',
    component: AdminProductFormComponent,
    title: 'Editar producto'
  }
];
