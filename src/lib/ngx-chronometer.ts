import { Subject, Subscription } from 'rxjs';
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
export class Chronometer {
    id: number;
    second: number;
    limitSecond: number;
    status: StatusChonometer;
    timeLabel: TimeChonometer;
    maxSecond: number;
    maxMinute: number;
    maxHour: number;
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
        this.maxSecond = o.maxSecond || 60;
        this.maxMinute = o.maxMinute || 60;
        this.maxHour = o.maxHour || 60;
        this.limitSecond = o.limitSecond;
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

    refresh() {
        this.onChronometer.next(this);
    }
}