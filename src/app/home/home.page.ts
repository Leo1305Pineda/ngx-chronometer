import { Component, OnInit } from '@angular/core';
import { Chronometer, StatusChonometer } from 'projects/ngx-chronometer/src/public-api';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  chronometer: Chronometer = new Chronometer({ second: 0 });
  chronometers: Array<Chronometer> = Array<Chronometer>();

  constructor() { }

  ngOnInit(): void {
    this.chronometers = new Array<Chronometer>(
      new Chronometer({
        id: 1,
        status: StatusChonometer.start
      }),
      new Chronometer({
        id: 2,
        second: 400
      }),
      new Chronometer({
        id: 3,
        status: StatusChonometer.start,
        rangeSecond: [0, 5],
        rangeMinute: [0, 5],
        rangeHour: [0, 5]
      })
    );
  }

  run(chronometer: Chronometer, status: StatusChonometer) {
    chronometer.status = status;
    console.log(chronometer.status, 'StatusChonometer');
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

}
