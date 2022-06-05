import { Component, OnInit, Inject } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } frsrc/app/services/producto.servicevice';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-delete-producto',
  templateUrl: './delete-producto.component.html',
  styleUrls: ['./delete-producto.component.scss']
})
export class DeleteProductoComponent implements OnInit {

  bookData$: Observable<Producto>;

  constructor(
    public dialogRef: MatDialogRef<DeleteProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public bookid: number,
    private bookService: ProductoService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.bookService.deleteBook(this.bookid).subscribe(
      () => {
      }, error => {
        console.log('Error ocurred while fetching book data : ', error);
      });
  }

  ngOnInit() {
    this.fetchBookData();
  }

  fetchBookData() {
    this.bookData$ = this.bookService.getBookById(this.bookid)
      .pipe(
        catchError(error => {
          console.log('Error ocurred while fetching book data : ', error);
          return EMPTY;
        }));
  }
}
