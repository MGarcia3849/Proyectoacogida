import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/components/home/home.component';
import { CategoryComponent } from './modules/category/components/category/category.component';
import { AdminComponent } from './modules/admin/components/admin/admin.component';
import { LoginComponent } from './modules/login/components/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'category',
    component: CategoryComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**', // Ruta para cualquier ruta no encontrada
    redirectTo: '', // Redirige a la ruta principal
    pathMatch: 'full' // Asegura que la redirección sea para rutas completas
  }
];
