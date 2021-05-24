import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyProductsPageRoutingModule } from './company-products-routing.module';

import { CompanyProductsPage } from './company-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyProductsPageRoutingModule
  ],
  declarations: [CompanyProductsPage]
})
export class CompanyProductsPageModule {}
