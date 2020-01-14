import { Directive, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Chronometer, StatusChonometer } from './ngx-chronometer';
import { Subscription, interval, Subject } from 'rxjs';
import * as _ from 'lodash';

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

  /** sequence the time default 1000 = 1 second */
  @Input() interval = 1000;
  /** increment 1 unit */
  @Input() increment = 1;
  /** limit in second stop sequence the time */
  @Input() limitSecond: number;
  /** maximal second to step minute */
  @Input() maxSecond: number;
  /** maximal minute to step hour */
  @Input() maxMinute: number;
  /** maximal hour to reset chronometer */
  @Input() maxHour: number;
  /** object chronometer */
  @Input() set chronometer(chronometer: Chronometer) {
    chronometer = chronometer || new Chronometer();
    chronometer.maxSecond = this.maxSecond || chronometer.maxSecond || 60;
    chronometer.maxMinute = this.maxMinute || chronometer.maxMinute || 60;
    chronometer.maxHour = this.maxHour || chronometer.maxHour || 60;
    chronometer.time = new Array<number>(0, 0, 0);
    this._chronometer = this.activated(this.currentSecond(chronometer));
  }
  /** format to use default 00:00:00 custom 00/00/00 or other delimiter */
  @Input() format = '00:00:00';
  /** activated emit event sequence chronometer default false */
  @Input() chronoEvents = false;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChronoEvent = new EventEmitter<Chronometer>();

  private chronoSub: Subscription;

  constructor() { }

  ngOnInit(): void {
    // tslint:disable-next-line:max-line-length
    if (this._chronometer.onChronometer.observers == null) {
      this._chronometer.onChronometer = new Subject<Chronometer>();
    }
    this.chronoSub = this._chronometer.onChronometer.subscribe((chronometer: Chronometer) => {
      this._chronometer = this.activated(this.currentSecond(chronometer));
    });
  }

  /**
   * @description current seconds
   * @param chronometer object current chronometer
   * @see {Chronometer}
   */
  currentSecond(chronometer: Chronometer): Chronometer {
    const limitSecond = this.limitSecond || chronometer.limitSecond;
    if (limitSecond && chronometer.second > limitSecond) {
      chronometer.second = limitSecond;
      chronometer.pause();
      this._chronometer = chronometer;
      if (this._chronometer.intervalSub) {
        this._chronometer.intervalSub.unsubscribe();
      }
      this._chronometer.intervalSub = undefined;
    }
    return chronometer;
  }

  /**
   * @description activated chronometer
   * @param chronometer object current chronometer
   * @see {Chronometer}
   */
  private activated(chronometer: Chronometer = this._chronometer): Chronometer {
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
    return this.setTime(chronometer, 0);
  }

  /**
   * @description pause seconds
   * @param chronometer object current chronometer
   * @see {Chronometer}
   */
  private pause(chronometer: Chronometer): Chronometer {
    return this.stop(chronometer);
  }

  /**
   * @description stop seconds
   * @param chronometer object current chronometer
   * @see {Chronometer}
   */
  private stop(chronometer): Chronometer {
    if (chronometer.intervalSub) {
      chronometer.intervalSub.unsubscribe();
      chronometer.intervalSub = undefined;
    }
    return chronometer;
  }

  /**
   * @description start seconds
   * @param chronometer object current chronometer
   * @see {Chronometer}
   */
  private start(chronometer: Chronometer): Chronometer {
    chronometer.status = 2;
    if (!chronometer.intervalSub) {
      chronometer.intervalSub = interval(this.interval).subscribe(() => {
        chronometer = this.currentSecond(this.setTime(chronometer));
      });
    }
    return chronometer;
  }

  /**
   * @description inner the text element
   * @see {Chronometer}
   */
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

  /**
   * @description format array time
   * @see {Chronometer}
   */
  get timeFormat(): Array<string> {
    const time = this._chronometer.time;
    return Array<string>(
      this.formatNumber(time[2]),
      this.formatNumber(time[1]),
      this.formatNumber(time[0])
    );
  }

  /**
   * @description return string 2 digit
   * @param n number to format
   */
  formatNumber(n: number): string {
    return `${n > 9 ? n : `0${n}`}`;
  }

  /**
   * @description validator number
   * @param n number to valid
   */
  validNumber(n: number) {
    const enc = !_.isNaN(_.isNumber(n)) && n > 0;
    if (!enc) {
      console.error('Outdid maximo time no valid', n);
      this._chronometer.pause();
    }
    return enc ? n : 60;
  }

  /**
   * @description
   * @param chronometer object current chronometer
   * @see {Chronometer}
   * @param second increment the time
   * @see {increment} default [increment]="1"
   */
  private setTime(chronometer: Chronometer, second = this.increment): Chronometer {
    if (chronometer.second >= 0) {
      chronometer.second = chronometer.second + second;
      const diffSS = this.validNumber(chronometer.maxSecond);
      const diffMM = this.validNumber(chronometer.maxMinute);
      const hh = Math.trunc((chronometer.second / this.validNumber(chronometer.maxSecond)) / this.validNumber(chronometer.maxMinute));
      const mm = Math.trunc(chronometer.second / this.validNumber(chronometer.maxSecond)) - hh * diffMM;
      const ss = chronometer.second - Math.trunc(chronometer.second / diffSS) * diffSS;
      if (hh === chronometer.maxHour) {
        chronometer.second = 0;
        chronometer.time = new Array(0, 0, 0);
      } else {
        chronometer.time = new Array(hh, mm, ss);
      }
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
    if (this._chronometer.intervalSub) {
      this._chronometer.intervalSub.unsubscribe();
    }
    this._chronometer.onChronometer.unsubscribe();
  }

}
