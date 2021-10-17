import { StopWatch } from './stop-watch.interface';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class TimeService {
    private readonly initialTime = 0;
    private lastStopedTimer: number = this.initialTime;
    private timerSubscription: Subscription = new Subscription();
    private RunTime: boolean = false;
    private interval = 0;

    constructor() {

    }

    private timer$: BehaviorSubject<number> = new BehaviorSubject(
        this.initialTime
    )

    get StopWatch$(): Observable<StopWatch> {
        return this.timer$.pipe(
            map((seconds: number): StopWatch => this.secondsStopWatch(seconds) )
        );
    }

    startTimer(): void {
        if (this.RunTime) {
            return;
        }
        this.timerSubscription = timer(0, 1000).pipe(
            map((value: number): number => value + this.lastStopedTimer)).subscribe(this.timer$);
            this.RunTime = true;
    }

    stopTimer(): void {
        this.lastStopedTimer = this.timer$.value;
        this.timerSubscription.unsubscribe();
        this.RunTime = false
    }

    resetTimer(): void {
        this.timerSubscription.unsubscribe();
        this.lastStopedTimer = this.initialTime;
        this.timer$.next(this.initialTime);
        this.RunTime = false;
    }

    private secondsStopWatch(seconds: number): StopWatch {
        let rest = seconds % 60;
        const sec = rest
        if (seconds % 60 === 0) this.interval = Math.floor(seconds / 6)
        const hours = Math.floor(seconds / 3600);
        rest = seconds % 3600;
        const minutes = Math.floor(rest / 60 );
        rest = seconds % 60;

        return {
           hours: `${hours < 10 ? "0" + hours : hours}`,
            minutes: `${minutes < 10 ? "0" + minutes : minutes}`,
            seconds:`${sec < 10 ? "0" + sec : sec}`
          };
    }



}

