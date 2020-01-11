import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
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

  @Input() rangeSecond: Array<number>;
  @Input() rangeMinute: Array<number>;
  @Input() rangeHour: Array<number>;

  @Input() set chronometer(chronometer: Chronometer) {
    chronometer = chronometer || new Chronometer();
    chronometer.rangeSecond = this.rangeSecond || chronometer.rangeSecond;
    chronometer.rangeMinute = this.rangeMinute || chronometer.rangeMinute;
    chronometer.rangeHour = this.rangeHour || chronometer.rangeHour;
    chronometer.time = new Array<number>(0, 0, 0);
    this._chronometer = this.activated(this.validRange(chronometer));
  }

  @Input() format = '00:00:00';

  chronoSub: Subscription;

  constructor(public el: ElementRef) { }

  ngOnInit(): void {
    this.chronoSub = this._chronometer.onChronometer.subscribe((chronometer: Chronometer) => {
      this.activated(chronometer);
    });
  }

  private activated(chronometer: Chronometer = new Chronometer()): Chronometer {
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
        this._chronometer = this.pause(new Chronometer());
        break;
    }
    return this.setTime(chronometer, 0);
  }

  validRange(chronometer: Chronometer): Chronometer {
    const arr = [chronometer.rangeSecond, chronometer.rangeMinute, chronometer.rangeHour];
    if (!Array.isArray(arr[0]) || arr[0].length !== 2) {
      console.error(`rangeSecond ${arr[0]} is no valid`, new Chronometer(chronometer));
      chronometer.rangeSecond = [0, 60];
    }
    if (!Array.isArray(arr[1]) || arr[1].length !== 2) {
      console.error(`rangeMinute ${arr[1]} is no valid`, new Chronometer(chronometer));
      chronometer.rangeMinute = [0, 60];
    }
    if (!Array.isArray(arr[2]) || arr[2].length !== 2) {
      console.error(`rangeHour ${arr[2]} is no valid`, new Chronometer(chronometer));
      chronometer.rangeHour = [0, 60];
    }
    return chronometer;
  }

  private pause(chronometer: Chronometer): Chronometer {
    this.stop(chronometer);
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
    const valid: Array<boolean> = [
      // tslint:disable-next-line:use-isnan
      _.toNumber(time[0]) === NaN || _.toNumber(time[0]) < 0,
      // tslint:disable-next-line:use-isnan
      _.toNumber(time[1]) === NaN || _.toNumber(time[1]) < 0,
      // tslint:disable-next-line:use-isnan
      _.toNumber(time[2]) === NaN || _.toNumber(time[2]) < 0
    ];
    if (valid[0] || valid[1] || valid[2]) {
      console.error('Outdid maximo range on second', this._chronometer);
    }
    return Array<string>(
      valid[2] ? '--' : `${time[2]}`,
      valid[1] ? '--' : `${time[1]}`,
      valid[0] ? '--' : `${time[0]}`);
  }

  onUnChronometer() {
    this._chronometer = new Chronometer({
      isActivated: false
    });
  }

  private setTime(chronometer: Chronometer, second = 1): Chronometer {
    if (chronometer.second >= 0) {
      chronometer.second = chronometer.second + second;

      const diffSS = this._chronometer.rangeSecond[1] - this._chronometer.rangeSecond[0];
      const diffMM = this._chronometer.rangeMinute[1] - this._chronometer.rangeMinute[0];

      const hh = Math.trunc(this.secToH);
      const mm = Math.trunc(this.secToM) - hh * diffMM;
      const ss = this._chronometer.second - Math.trunc(chronometer.second / diffSS) * diffSS;

      this._chronometer.time = new Array(hh, mm, ss);
    }
    return chronometer;
  }

  get secToM(): number {
    return this._chronometer.second / (this._chronometer.rangeSecond[1] - this._chronometer.rangeSecond[0]);
  }

  get secToH(): number {
    return this.secToM / (this._chronometer.rangeMinute[1] - this._chronometer.rangeMinute[0]);
  }

  private stop(chronometer): Chronometer {
    if (chronometer.intervalSub) {
      chronometer.intervalSub.unsubscribe();
      chronometer.intervalSub = undefined;
    }
    return chronometer;
  }

  ngOnDestroy() {
    if (this.chronoSub) {
      this.chronoSub.unsubscribe();
    }
  }

}
