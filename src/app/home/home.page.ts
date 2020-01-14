import { Component, OnInit } from '@angular/core';
import { Chronometer, StatusChonometer } from 'projects/ngx-chronometer/src/public-api';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  chronometer: Chronometer = new Chronometer({ second: 400 });
  chronometers: Array<Chronometer> = Array<Chronometer>();
  display = true;

  constructor() { }

  ngOnInit(): void {
    this.chronometers = new Array<Chronometer>(
      new Chronometer({
        id: 1,
        second: 19,
        status: StatusChonometer.start,
        limitSecond: 25
      }),
      new Chronometer({
        id: 2,
        second: 400,
        status: StatusChonometer.start,
      }),
      new Chronometer({
        id: 3,
        status: StatusChonometer.start,
        maxSecond: 5,
        maxMinute: 5,
        maxHour: 5
      })
    );
  }

  onChronoEvent(chronometer: Chronometer) {
    console.log(chronometer);
  }

  refresh(c: Chronometer) {
    c.status = 2;
    c.second = c.second + 20;
    c.refresh();
  }

  run(chronometer: Chronometer, status: StatusChonometer) {
    chronometer.status = status;
    // console.log(chronometer.status, 'StatusChonometer');
    switch (chronometer.status) {
      case StatusChonometer.pause:
        chronometer.pause();
        break;
      case StatusChonometer.restart:
        chronometer.restart();
        break;
      case StatusChonometer.start:
        chronometer.start();
        break;
      default:
        break;
    }
  }

  unsubcribeAll() {
    this.display = false;
    this.chronometer.onChronometer.unsubscribe();
    this.chronometers.forEach((chronometer: Chronometer) => {
      // console.log(_.clone(chronometer.onChronometer));
      if (chronometer.onChronometer) {
        chronometer.onChronometer.unsubscribe();
      }
      // console.log(_.clone(chronometer.onChronometer));
    });
    setTimeout(() => this.display = true, 4000);
  }

}
