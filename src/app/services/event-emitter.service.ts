import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  dataEmitter: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  sendData(data: any) {
    this.dataEmitter.emit(data);
  }
}
