import { Directive, ElementRef, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Chronometer, StatusChonometer } from './ngx-chronometer';
import { Subscription, interval } from 'rxjs';
import * as _ from 'lodash';

const INTERVAL = 1000;
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[chronometer]',
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '[innerText]': 'innerText'
  }
})
export class NgxChronometerDirective implements OnInit, OnDestroy {

  // tslint:disable-next-line:variable-name
  _chronometer: Chronometer = new Chronometer();

  @Input() maxSecond: number;
  @Input() maxMinute: number;
  @Input() maxHour: number;
  @Input() set chronometer(chronometer: Chronometer) {
    chronometer = chronometer || new Chronometer();
    chronometer.maxSecond = this.maxSecond || chronometer.maxSecond || 60;
    chronometer.maxMinute = this.maxMinute || chronometer.maxMinute || 60;
    chronometer.maxHour = this.maxHour || chronometer.maxHour || 60;
    chronometer.time = new Array<number>(0, 0, 0);
    // chronometer = this.validRange(chronometer);
    // console.log(this._chronometer, chronometer, _.isEqual(this._chronometer, chronometer));
    console.log(_.clone(this._chronometer), 'A');
    this._chronometer = this.activated(chronometer);
  }
  @Input() format = '00:00:00';
  @Input() chronoEvents = false;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChronoEvent = new EventEmitter<Chronometer>();

  chronoSub: Subscription;

  constructor(public el: ElementRef) { }

  ngOnInit(): void {
    this.chronoSub = this._chronometer.onChronometer.subscribe((chronometer: Chronometer) => {
      // console.log(this._chronometer, chronometer, _.isEqual(this._chronometer, chronometer));
      this.activated(chronometer);
    });
  }

  private activated(chronometer: Chronometer = this._chronometer): Chronometer {
    this._chronometer = this.setTime(chronometer, 0);
    switch (chronometer.status) {
      case StatusChonometer.pause:
        this._chronometer = this.pause(chronometer); break;
      case StatusChonometer.start:
        this._chronometer = this.start(this.pause(chronometer));
        break;
      case StatusChonometer.restart:
        chronometer.second = 0;
        this._chronometer = this.start(chronometer);
        break;
      case StatusChonometer.stop:
        chronometer.second = 0;
        this._chronometer = this.pause(chronometer);
        break;
      default:
        break;
    }
    return this._chronometer;
  }

  private pause(chronometer: Chronometer): Chronometer {
    return this.stop(chronometer);
  }

  private stop(chronometer): Chronometer {
    if (chronometer.intervalSub) {
      chronometer.intervalSub.unsubscribe();
      chronometer.intervalSub = undefined;
    }
    return chronometer;
  }

  private start(chronometer: Chronometer): Chronometer {
    chronometer.status = 2;
    if (!chronometer.intervalSub) {
      this._chronometer.intervalSub = interval(INTERVAL).subscribe(() => {
        this._chronometer = this.setTime(chronometer);
      });
    }
    return chronometer;
  }

  get innerText(): string {
    const sep = this.format.split('00');
    switch (sep.length) {
      case 1: return `${sep[0]}${this.timeFormat[0]}${sep[1]}`;
      case 2: return `${sep[0]}${this.timeFormat[0]}${sep[1]}`;
      case 3: return `${sep[0]}${this.timeFormat[1]}${sep[1]}${this.timeFormat[0]}${sep[2]}`;
      case 4: return `${sep[0]}${this.timeFormat[2]}${sep[1]}${this.timeFormat[1]}${sep[2]}${this.timeFormat[0]}${sep[3]}`;
      default: return `${sep[0]}${this.timeFormat[2]}${sep[1]}${this.timeFormat[1]}${sep[2]}${this.timeFormat[0]}${sep[3]}`;
    }
  }

  get timeFormat(): Array<string> {
    const time = this._chronometer.time;
    return Array<string>(
      this.formatNumber(time[2]),
      this.formatNumber(time[1]),
      this.formatNumber(time[0])
    );
  }

  formatNumber(n: number): string {
    return `${n > 9 ? n : `0${n}`}`;
  }

  validNumber(n: number) {
    const enc = !_.isNaN(_.isNumber(n)) && n > 0;
    if (!enc) {
      console.error('Outdid maximo time no valid', n);
      this._chronometer.pause();
    }
    return enc ? n : 60;
  }

  private setTime(chronometer: Chronometer, second = 1): Chronometer {
    if (chronometer.second >= 0) {
      chronometer.second = chronometer.second + second;
      const diffSS = this.validNumber(this._chronometer.maxSecond);
      const diffMM = this.validNumber(this._chronometer.maxMinute);
      const hh = Math.trunc((chronometer.second / this.validNumber(chronometer.maxSecond)) / this.validNumber(this._chronometer.maxMinute));
      const mm = Math.trunc(chronometer.second / this.validNumber(chronometer.maxSecond)) - hh * diffMM;
      const ss = chronometer.second - Math.trunc(chronometer.second / diffSS) * diffSS;
      chronometer.time = new Array(hh, mm, ss);
    }
    if (this.chronoEvents) {
      this.onChronoEvent.emit(chronometer);
    }
    return chronometer;
  }

  ngOnDestroy() {
    if (this.chronoSub) {
      this.chronoSub.unsubscribe();
    }
    if (this._chronometer.onChronometer) {
      this._chronometer.onChronometer.unsubscribe();
    }
  }

}
