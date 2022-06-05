import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Producto } from 'src/app/models/producto';
import { ProductoService } frsrc/app/services/producto.servicevice';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss']
})
export class ProductoFormComponent implements OnInit, OnDestroy {

  private formData = new FormData();
  productoForm: FormGroup;
  producto: Producto = new Producto();
  formTitle = 'Add';
  coverImagePath;
  productoId;
  files;
  categoryList: [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router) {

    this.productoForm = this.fb.group({
      productoId: 0,
      title: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  get title() {
    return this.productoForm.get('title');
  }

  get author() {
    return this.productoForm.get('author');
  }

  get category() {
    return this.productoForm.get('category');
  }

  get price() {
    return this.productoForm.get('price');
  }

  ngOnInit() {
    this.productoService.categories$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (categoryData: []) => {
          this.categoryList = categoryData;
        }, error => {
          console.log('Error ocurred while fetching category List : ', error);
        });

    this.route.params.subscribe(
      params => {
        if (params.id) {
          this.productoId = +params.id;
          this.fetchBookData();
        }
      }
    );
  }

  fetchBookData() {
    this.formTitle = 'Edit';
    this.productoService.getBookById(this.productoId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result: Producto) => {
          this.setBookFormData(result);
        }, error => {
          console.log('Error ocurred while fetching book data : ', error);
        });
  }

  onFormSubmit() {
    if (!this.productoForm.valid) {
      return;
    }
    if (this.files && this.files.length > 0) {
      for (let j = 0; j < this.files.length; j++) {
        this.formData.append('file' + j, this.files[j]);
      }
    }
    this.formData.append('bookFormData', JSON.stringify(this.productoForm.value));

    if (this.productoId) {
      this.editBookDetails();
    } else {
      this.saveBookDetails();
    }
  }

  editBookDetails() {
    this.productoService.updateBookDetails(this.formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => {
          this.router.navigate(['/admin/productos']);
        }, error => {
          console.log('Error ocurred while updating book data : ', error);
        });
  }

  saveBookDetails() {
    this.productoService.addBook(this.formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => {
          this.router.navigate(['/admin/productos']);
        }, error => {
          this.productoForm.reset();
          console.log('Error ocurred while adding book data : ', error);
        });
  }

  cancel() {
    this.router.navigate(['/admin/productos']);
  }

  setBookFormData(bookFormData) {
    this.productoForm.setValue({
      bookId: bookFormData.bookId,
      title: bookFormData.title,
      author: bookFormData.author,
      category: bookFormData.category,
      price: bookFormData.price
    });
    this.coverImagePath = '/Upload/' + bookFormData.coverFileName;
  }

  uploadImage(event) {
    this.files = event.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (myevent: ProgressEvent) => {
      this.coverImagePath = (myevent.target as FileReader).result;
    };
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
