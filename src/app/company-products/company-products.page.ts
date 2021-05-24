import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../interfaces/product';
import { User } from '../interfaces/user';
import { ProductsService } from '../services/products.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-company-products',
  templateUrl: './company-products.page.html',
  styleUrls: ['./company-products.page.scss'],
})
export class CompanyProductsPage implements OnInit {

  company: string;
  products: Array<Product>

  constructor(private router: Router,
    private productsService:ProductsService) { 

      this.company = this.router.getCurrentNavigation().extras.state.company;

      this.productsService.getProductsByCompany(this.company).snapshotChanges().pipe(
        map(changes => 
          changes.map(c => 
            ({key: c.payload.doc.id, ...c.payload.doc.data()})
          )
        )
      ).subscribe(products => {
        this.products = products;
      });
      
   }

  ngOnInit() {
  }

  displayProduct(key){
    this.router.navigateByUrl("product", {state: {key: key}});
  }

}
