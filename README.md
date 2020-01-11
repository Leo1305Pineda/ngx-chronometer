# Ngx-Chronometer

Directive chronometer.

## Installing

Run `npm i ngx-chronometer`.

## Quickstart

Import ngx-chronometer in you module page.

```typescript
// Import the module
import { NgxChronometerModule } from 'ngx-chronometer';
...
@NgModule({
    (...)
    imports: [
        NgxChronometerModule
    ],
    (...)
})
export class PageModule {}
```

## Usage
```typescript
chronometer: Chronometer = new Chronometer();
```

```html
<div>Time: <b [chronometer]="chronometer"></b></div>
```

or Array

```typescript
chronometers: Array<Chronometer> = Array<Chronometer>();
```

```html
<div *ngFor="let chronometer of chronometers">
     Time: <b [chronometer]="chronometer"></b>
</div>
```

## Example

```typescript
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
            rangeSecond: [0, 20], // default [0, 60]
            rangeMinute: [0, 40], // default [0, 60]
            rangeHour: [0, 60] // default [0, 60]
        })
    );
}

run(chronometer: Chronometer, status: StatusChonometer) {
    chronometer.status = status;
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
```

```html
<div *ngFor="let chronometer of chronometers">
    Time: <b [chronometer]="chronometer"></b>
    <ion-button slot="start" (click)="run(chronometer, chronometer.status === 2 ? 1 : 2)">
        {{ chronometer.status === 2 ? 'Pause' : 'Start' }}
    </ion-button>
    <ion-button slot="end" (click)="run(chronometer, 4)">
        Restart
    </ion-button>
</div>
```

### StatusChonometer

```typescript
enum StatusChonometer {
    desactived = 0,
    pause = 1,
    start = 2,
    finish = 3,
    restart = 4,
    stop = 5,
    refresh = 6
}
```

### Input
```typescript
format = '00:00:00'; // delimiter char "/, :, -" used const sep = this.format.split('00');
rangeSecond: Array<number> = new Array<number>(0, 60); // defaul [0, 60]
rangeMinute: Array<number> = new Array<number>(0, 120); // defaul [0, 60]
rangeHour: Array<number> = new Array<number>(0, 60); // defaul [0, 60]
```
```html
   <b [chronometer]="chronometer" [format]="format"></b>
   <b [chronometer]="chronometer" [rangeSecond]="rangeSecond" [rangeMinute]="rangeMinute" [rangeHour]="rangeHour"></b>
```