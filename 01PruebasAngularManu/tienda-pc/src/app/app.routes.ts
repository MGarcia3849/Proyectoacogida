import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { PanelComponent } from './pages/panel.component';
import { InventarioComponent } from './pages/inventario.component';
import { isLoggedInGuard } from './guards/auth.guard'; // 👈 Nuestro guard personalizado


import { InicioComponent } from './pages/inicio.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [isLoggedInGuard]
  },
  {
    path: 'panel',
    component: PanelComponent,
    canActivate: [isLoggedInGuard]
  },
  {
    path: 'inventario',
    component: InventarioComponent,
    canActivate: [isLoggedInGuard]
  }
];

