import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyProductsPage } from './company-products.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyProductsPageRoutingModule {}
