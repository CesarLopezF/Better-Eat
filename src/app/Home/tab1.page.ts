import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../interfaces/product';
import { User } from '../interfaces/user';
import { ProductsService } from '../services/products.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  user$:Observable<User> = this.userService.afAuth.user;
  ready: boolean = false;

  healthyProducts: Array<Product>;
  recentProducts: Array<Product>;

  userdata: any;

  constructor(
    private userService:UserService,
    private productsService:ProductsService,
    private router:Router) {

      this.user$.subscribe(async userdata => {
        this.userdata = userdata;
      })

    

    this.productsService.getRecentHealthyProducts().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => 
          ({key: c.payload.doc.id, ...c.payload.doc.data()})
        )
      )
    ).subscribe(healthyProducts => {
      this.healthyProducts = healthyProducts;
      this.ready = true;
    })

    this.productsService.getRecentProducts().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({key: c.payload.doc.id, ...c.payload.doc.data()})
        )
      )
    ).subscribe(products => {
      this.recentProducts = products;
    })
  }

  async profile(){
    this.router.navigateByUrl('profile');
  }

  displayProduct(key){
    this.router.navigateByUrl("product", {state: {key: key}});
  }

}
