import { interval, Subject, Subscription, timer } from 'rxjs';
import { StopWatch } from './stop-watch.interface';
import { OnDestroy } from '@angular/core';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { TimeService } from './timer.service';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';
import { fromEvent,  } from 'rxjs'; 
import { map, buffer, debounceTime, filter, exhaustMap, takeUntil, throttleTime, take, tap } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'StopWatch';
  stopWatch!: StopWatch;
  nextBtn = false;
  @ViewChild('dbClick') dbClick!: ElementRef

  private subscription: Subscription = new Subscription();

  constructor(private timerService: TimeService) {
      this.subscription.add(
        this.timerService.StopWatch$.subscribe(
          (val: StopWatch) => (this.stopWatch = val)
        )
      );
     
  
  }

  startTimer(): void {
    this.timerService.startTimer();
    this.nextBtn = true
  }

  resetTimer(): void {
    this.timerService.resetTimer();
    this.timerService.startTimer()
  }

  stopTimer(): void {
    this.timerService.resetTimer();
    this.nextBtn = false
  } 

  waitTimer() {
    this.timerService.stopTimer();
    this.nextBtn = false;
  }

  public dbClickCheck(): void {
    let lastClicked = 0;
    this.subscription = fromEvent(this.dbClick.nativeElement, 'click').pipe(take(2), tap(v => {
      const timeNow = new Date().getTime();
      if (timeNow < (lastClicked + 300)) this.waitTimer();
      lastClicked = timeNow;
    })).subscribe();
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

}


