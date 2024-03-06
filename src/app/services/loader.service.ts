import { Injectable, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading = new Subject<boolean>();
  @Input() delayTime = 0;

  constructor() { }

  assignDelayTime(delay = 0) {
    if (delay > 0) {
      this.delayTime = delay;
    }
  }

  show() {
    // console.log('(i) Show loader');
    this.isLoading.next(true);
  }
  hide() {
    // console.log('(i) Hide delay',this.delayTime);
    setTimeout(() => {
      this.isLoading.next(false);
      // console.log("(i) Hide progress bar");
    }, this.delayTime);
  }
}
