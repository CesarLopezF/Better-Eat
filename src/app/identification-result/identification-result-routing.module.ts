import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdentificationResultPage } from './identification-result.page';

const routes: Routes = [
  {
    path: '',
    component: IdentificationResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentificationResultPageRoutingModule {}
