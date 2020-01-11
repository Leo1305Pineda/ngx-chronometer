import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { NgxChronometerModule } from 'projects/ngx-chronometer/src/public-api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxChronometerModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
