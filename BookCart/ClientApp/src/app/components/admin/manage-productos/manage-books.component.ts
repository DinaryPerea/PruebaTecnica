import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.servicevice';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DeleteProductoComponent } from '../delete-producto/delete-producto.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeleteBookComponent } from '../delete-producto/delete-book.component';

@Component({
  selector: 'app-manage-productos',
  templateUrl: './manage-productos.component.html',
  styleUrls: ['./manage-productos.component.scss']
})
export class ManageProductsComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'title', 'author', 'category', 'price', 'operation'];

  dataSource = new MatTableDataSource<Producto>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private unsubscribe$ = new Subject<void>();
  constructor(
    private productoService: ProductoService,
    public dialog: MatDialog,
    private snackBarService: SnackbarService) {
  }

  ngOnInit() {
    this.getAllBookData();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllBookData() {
    this.productoService.getAllBooks()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Producto[]) => {
        this.dataSource.data = Object.values(data);
      }, error => {
        console.log('Error ocurred while fetching product details : ', error);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteConfirm(id: number): void {
    const dialogRef = this.dialog.open(DeleteBookComponent, {
      data: id
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        if (result === 1) {
          this.getAllBookData();
          this.snackBarService.showSnackBar('Data deleted successfully');
        } else {
          this.snackBarService.showSnackBar('Error occurred!! Try again');
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
