import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent)
      },
      {
        path: 'productos',
        loadChildren: () =>
          import('./products/products.routes').then((m) => m.PRODUCTS_ROUTES)
      },
      { path: 'producto/:id', component: ProductDetailComponent },
      {
        path: 'carrito',
        loadComponent: () =>
          import('./cart/cart/cart.component').then((m) => m.CartComponent)
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES)
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.component').then((m) => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/register/register.component').then((m) => m.RegisterComponent)
      },
      {
        path: 'soporte',
        loadComponent: () =>
          import('./pages/soporte/soporte.component').then((m) => m.SoporteComponent)
      },
    ]
  },
  
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent)
  }
];
