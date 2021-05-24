import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdentificationResultPageRoutingModule } from './identification-result-routing.module';

import { IdentificationResultPage } from './identification-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IdentificationResultPageRoutingModule
  ],
  declarations: [IdentificationResultPage]
})
export class IdentificationResultPageModule {}
