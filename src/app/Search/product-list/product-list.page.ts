import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavParams, PopoverController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  search: string;
  productList: Product[];

  constructor(private navParams: NavParams,
    private productsService: ProductsService,
    private router: Router,
    private popover: PopoverController) { 
      this.search = this.navParams.get("search");
      
      this.productsService.getProducts().snapshotChanges().pipe(
        map(changes => 
          changes.map(c =>
            ({key: c.payload.doc.id, ...c.payload.doc.data()})
          )
        )
      ).subscribe(products => {
  
        this.productList = products.filter(currentProduct => {
          if(currentProduct.name && this.search){
            return (currentProduct.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
          }
        })
  
      })

   }
  ngOnInit() {
  }

  productPage(i){
    this.router.navigateByUrl("product", {state: {key: this.productList[i].key}});
    this.popover.dismiss();
  }

}
