import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  store = new BehaviorSubject<any>({});
  selectedItem$ = this.store.asObservable();
  
  constructor() {}
  public setItem(item: any) {
    this.store.next(item);
  }
  public getItem(): Observable<any> { 
    return this.selectedItem$;
   }

}
