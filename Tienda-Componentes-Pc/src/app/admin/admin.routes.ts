import { Routes } from '@angular/router';
import { AdminProductListComponent } from './admin-product-list/admin-product-list.component';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminReportsComponent } from './admin-reports/admin-reports.component'; 
import { AdminComponent } from './admin.component';

export const ADMIN_ROUTES: Routes = [
  { path: '',
    component: AdminComponent,
    title: 'Panel de Administrador',
    children: [

      { path: 'products', title: 'Gestión de productos vista administrador',

        children: [
          { path: '', component: AdminProductListComponent, title: 'Panel de administrador de productos' },
          { path: 'nuevo', component: AdminProductFormComponent, title: 'Panel de nuevo producto' },
          { path: 'editar/:id', component: AdminProductFormComponent, title: 'Panel editar producto' }
        ]

      },
      { path: 'users', component: AdminUsersComponent, title: 'Gestor de usuarios vista administrador' },
      { path: 'reports', component: AdminReportsComponent, title: 'Informes vista administrador' }
      
    ]
  }
];
