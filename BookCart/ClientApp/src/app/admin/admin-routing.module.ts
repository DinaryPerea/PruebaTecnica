import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductoFormComponent } from '../components/admin/producto-form/producto-form.component';
import { ManageProductosComponent } from '../components/admin/manage-productos/manage-productos.component';

const adminRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'new', component: ProductoFormComponent },
      { path: ':id', component: ProductoFormComponent },
      { path: '', component: ManageProductosComponent },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
