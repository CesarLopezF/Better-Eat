import { Injectable } from '@angular/core';


import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private afs:AngularFirestore) { }

  getProduct(key): AngularFirestoreDocument<Product>{
    return this.afs.doc<Product>(`products/${key}`);
  }

  getProducts(): AngularFirestoreCollection<Product>{
    return this.afs.collection<Product>("products", ref => ref.orderBy("name"));
  }

  getRecentHealthyProducts(): AngularFirestoreCollection<Product>{
    return this.afs.collection<Product>("products", ref => ref.where("healthy","==",true).orderBy("dateAdded","desc").limit(6));
  }

  getRecentProducts(): AngularFirestoreCollection<Product>{
    return this.afs.collection<Product>("products", ref => ref.orderBy("dateAdded", "desc").limit(6));
  }

  getHealthyProductsByCategory(category): AngularFirestoreCollection<Product>{
    return this.afs.collection<Product>("products", ref => ref.where("healthy", "==",true).where("category","==",category).limit(3));
  }

  getProductsByCompany(company): AngularFirestoreCollection<Product>{
    return this.afs.collection<Product>("products", ref => ref.where("company","==",company));
  }

  updateScore(key, score){
    const Product:AngularFirestoreDocument<any> = this.afs.doc(`products/${key}`);

    const data = {
      score: score
    };
    
    return Product.set(data, {merge: true})
  }
}
