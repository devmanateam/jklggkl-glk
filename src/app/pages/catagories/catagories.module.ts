import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatagoriesPageRoutingModule } from './catagories-routing.module';

import { CatagoriesPage } from './catagories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatagoriesPageRoutingModule
  ],
  declarations: [CatagoriesPage]
})
export class CatagoriesPageModule {}
