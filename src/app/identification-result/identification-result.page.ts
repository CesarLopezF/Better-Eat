import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Product } from '../interfaces/product';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-identification-result',
  templateUrl: './identification-result.page.html',
  styleUrls: ['./identification-result.page.scss'],
})
export class IdentificationResultPage implements OnInit {

  visionData: { key: string, category: string, percentage: number }[];
  products: Array<Product>
  healthyRecommendations: Array<Product>;
  result: boolean;

  constructor(private router: Router,
    private productsService: ProductsService) { 
    this.visionData = this.router.getCurrentNavigation().extras.state.products;

    console.log(Math.round(((this.visionData[0].percentage*100) + Number.EPSILON) * 100) / 100);

    this.products = [];

    if(Math.round(((this.visionData[0].percentage*100) + Number.EPSILON) * 100) / 100 < 50){
      this.result = false;
      console.log("Inferior", this.result);
    } else {
      this.result = true;
      console.log("Superior", this.result);

      this.visionData.forEach(data => {
        this.productsService.getProduct(data.key).get().pipe(
          map(snapshot => ({key: snapshot.id, ...snapshot.data(), percentage: Math.round(((data.percentage*100) + Number.EPSILON) * 100) / 100}))
        ).subscribe(product => {
          this.products.push(product);
        })
      })
  
      this.productsService.getHealthyProductsByCategory(this.visionData[0].category).snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({key: c.payload.doc.id, ...c.payload.doc.data()})
          )
        )
      ).subscribe(products => {
        this.healthyRecommendations = products;
      })
    }

    
  }

  displayProduct(key){
    this.router.navigateByUrl("product", {state: {key: key}});
  }

  ngOnInit() {
  }

}
