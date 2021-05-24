import { Injectable } from '@angular/core';


import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Company } from '../interfaces/company'

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(private afs:AngularFirestore) { }

  getHealthyCompanies(): AngularFirestoreCollection<Company>{
    return this.afs.collection<Company>("companies", ref => ref.where("healthy","==",true));
  }

  getOtherCompanies(): AngularFirestoreCollection<Company>{
    return this.afs.collection<Company>("companies", ref => ref.where("healthy","==",false));
  }
}
