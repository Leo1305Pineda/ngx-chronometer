import { Subject, Subscription } from 'rxjs';

export class Chronometer {
    id: number;
    second: number;
    status: StatusChonometer;
    timeLabel: TimeChonometer;
    rangeSecond: Array<number>;
    rangeMinute: Array<number>;
    rangeHour: Array<number>;
    time: Array<number> = new Array<number>(0, 0, 0);
    onChronometer: Subject<Chronometer> = new Subject<Chronometer>();
    intervalSub: Subscription;
    /**
     * @description Constructor of class
     * @param o Object default = {}
     */
    constructor(o: any = {}) {
        this.id = o.id;
        this.second = o.second || 0;
        this.status = o.status || StatusChonometer.pause;
        this.timeLabel = o.timeLabel;
        this.rangeSecond = o.rangeSecond || new Array<number>(0, 60);
        this.rangeMinute = o.rangeMinute || new Array<number>(0, 60);
        this.rangeHour = o.rangeHour || new Array<number>(0, 60);
    }

    start() {
        this.status = StatusChonometer.start;
        this.onChronometer.next(this);
    }

    pause() {
        this.status = StatusChonometer.pause;
        this.onChronometer.next(this);
    }

    restart() {
        this.status = StatusChonometer.restart;
        this.onChronometer.next(this);
    }

    stop() {
        this.status = StatusChonometer.stop;
        this.onChronometer.next(this);
    }

    clear() {
        this.second = 0;
        this.onChronometer.next(null);
    }
}

export enum TimeChonometer {
    timemedio = 0,
    timeone = 1,
    timetwo = 2
}

export enum StatusChonometer {
    desactived = 0,
    pause = 1,
    start = 2,
    finish = 3,
    restart = 4,
    stop = 5,
    refresh = 6
}
