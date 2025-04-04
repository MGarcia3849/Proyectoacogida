import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';
import { AdminProductListComponent } from './admin-product-list/admin-product-list.component';

const routes: Routes = [
  { path: '', component: AdminComponent},
  { path: 'productos', component: AdminProductListComponent },
  { path: 'agregar-producto', component: AdminProductFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
