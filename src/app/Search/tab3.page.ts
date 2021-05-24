import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { Company } from '../interfaces/company';
import { CompaniesService } from '../services/companies.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ProductListPage } from './product-list/product-list.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  user$:Observable<User> = this.userService.afAuth.user;

  healthyCompanies: Array<Company>;
  otherCompanies: Array<Company>;

  constructor(
    private userService:UserService,
    private companyService:CompaniesService,
    private router:Router,
    private popover: PopoverController) {
      
      this.companyService.getHealthyCompanies().snapshotChanges().pipe(
        map(changes => 
          changes.map(c => 
            ({key: c.payload.doc.id, ...c.payload.doc.data()})
          )
        )
      ).subscribe(healthyCompanies => {
        this.healthyCompanies = healthyCompanies;
      })

      this.companyService.getOtherCompanies().snapshotChanges().pipe(
        map(changes => 
          changes.map(c => 
            ({key: c.payload.doc.id, ...c.payload.doc.data()})
          )
        )
      ).subscribe(otherCompanies => {
        this.otherCompanies = otherCompanies;
      })


    }

    profile(){
      this.router.navigateByUrl('profile');
    }

    displayCompany(company){
      this.router.navigateByUrl("company-products", {state: {company: company}})
    }

    async search(q, event){
      const popover = await this.popover.create({
        component: ProductListPage,
        translucent: true,
        componentProps: {search: q},
        event: event,
      });
      await popover.present();
    }
    

}
