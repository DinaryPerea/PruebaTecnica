import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { BookFormComponent } from '../components/admin/producto-form/book-form.component';
import { ManageBooksComponent } from '../components/admin/manage-productos/manage-books.component';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { DeleteBookComponent } from '../components/admin/delete-producto/delete-book.component';

@NgModule({
  declarations: [
    BookFormComponent,
    ManageBooksComponent,
    DeleteBookComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    NgMaterialModule
  ],
})
export class AdminModule { }

