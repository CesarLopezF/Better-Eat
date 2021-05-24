import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoreCommentsPageRoutingModule } from './more-comments-routing.module';

import { MoreCommentsPage } from './more-comments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoreCommentsPageRoutingModule
  ],
  declarations: [MoreCommentsPage]
})
export class MoreCommentsPageModule {}
