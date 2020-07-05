import { ProductDialogComponent } from './../product-dialog/product-dialog.component';
import { Product } from "./../product.model";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "./../product.service";
import { Component, OnInit } from "@angular/core";
import { Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: "app-product-update",
  templateUrl: "./product-update.component.html",
  styleUrls: ["./product-update.component.css"],
})
export class ProductUpdateComponent implements OnInit {
  product: Product = {
    name: '',
    price: 0,
    description: '',
    discount: null,
    discountPrice: null
  }
  discountControl: FormControl

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get("id");
    this.productService.readById(id).subscribe((product) => {
      this.product = product;

      this.discountControl = new FormControl(this.product.discount, [Validators.min(0), Validators.max(100)]);
      this.discountControl.valueChanges.subscribe(value => {
        this.product.discount = value;
      });
    });
  }

  updateProduct(): void {
    this.productService.update(this.product).subscribe(() => {
      this.productService.showMessage("Produto atualizado com sucesso!");
      this.router.navigate(["/products"]);
    });
  }

  checkAndUpdate(): void {
    if (this.product.discount == 100) {
      const dialogRef = this.dialog.open(ProductDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateProduct();
        }
      });
    } else {
      this.updateProduct();
    }
  }

  cancel(): void {
    this.router.navigate(["/products"]);
  }

  calculateDiscountPrice(): void {
    if (this.product.discount >= 0 && this.product.discount <= 100)
      this.product.discountPrice = this.product.price - (this.product.price * (this.product.discount / 100));
  }
}
