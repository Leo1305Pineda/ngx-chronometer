import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxChronometerDirective } from './ngx-chronometer.directive';


@NgModule({
  declarations: [NgxChronometerDirective],
  imports: [],
  exports: [NgxChronometerDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NgxChronometerModule { }
