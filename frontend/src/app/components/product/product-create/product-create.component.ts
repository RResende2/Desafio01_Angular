import { Product } from './../product.model';
import { ProductService } from './../product.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  product: Product = {
    name: '',
    price: null,
    description: '',
    discount: null,
    discountPrice: null
  }
  discountControl: FormControl

  constructor(
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.discountControl = new FormControl(this.product.discount, [Validators.min(0), Validators.max(100)]);
    this.discountControl.valueChanges.subscribe(value => {
      this.product.discount = value;
    });
  }

  createProduct(): void {
    this.productService.create(this.product).subscribe(() => {
      this.productService.showMessage('Produto criado!')
      this.router.navigate(['/products'])
    });
  }

  checkAndCreate(): void {
    if (this.product.discount == 100) {
      const dialogRef = this.dialog.open(ProductDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.createProduct();
        }
      });
    } else {
      this.createProduct();
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  calculateDiscountPrice(): void {
    if (this.product.discount >= 0 && this.product.discount <= 100)
      this.product.discountPrice = this.product.price - (this.product.price * (this.product.discount / 100));
  }
}
