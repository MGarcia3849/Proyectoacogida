// src/app/app.routes.ts
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
        // Carga directa de las rutas de productos (esto ya estaba bien)
        loadChildren: () =>
          import('./products/products.routes').then((m) => m.PRODUCTS_ROUTES)
      },
      // La ruta de detalle ya estaba definida aquí, es redundante tenerla en products.routes.ts también.
      // Mantenla aquí si quieres que funcione sin el prefijo '/productos'.
      // Si siempre es '/productos/producto/:id', puedes quitar esta y dejar la de products.routes.ts.
      // Por simplicidad y consistencia con otras secciones, la dejamos aquí.
      { path: 'producto/:id', component: ProductDetailComponent },
      {
        path: 'carrito',
        loadComponent: () =>
          import('./cart/cart/cart.component').then((m) => m.CartComponent)
      },
      {
        path: 'admin',
        // Carga directa de las rutas de admin (eliminando loadChildren de AdminRoutingModule)
        loadChildren: () =>
          import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES) // <-- CORRECCIÓN AQUÍ
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
      // Puedes agregar aquí otras rutas hijas si es necesario
    ]
  },
  {
    path: '**', // Ruta catch-all al final
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent)
  }
];
