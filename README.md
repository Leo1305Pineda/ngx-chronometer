# IonCollapseHeader

This directive collapse header in ionic 4 with the scroll content.

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

Then, just define collapse-haeder in the tag ion-content.

```html
 <ion-header #header></ion-header>
 <ion-content #content collapse-header [scrollEvents]=true [content]="content" [header]="header"></ion-content>
```