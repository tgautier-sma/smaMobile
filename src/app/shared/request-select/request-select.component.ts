import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage.service';

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-request-select',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, InputTextModule, InputGroupModule, DropdownModule
  ],
  templateUrl: './request-select.component.html',
  styleUrl: './request-select.component.scss'
})
export class RequestSelectComponent implements OnChanges {
  searchUrl = "https://smabtp.fr";
  saveAuto = false;
  requestsHistory!: any;
  @Input() keyStore:string = "sma-exp_urls";
  @Input() search:string = "https://smabtp.frs";
  @Input() autoSave!: boolean;                        // If TRUE, save the URL
  @Output() urlSelected = new EventEmitter<string>();  // Send the url to the parent
  constructor(
    private storage: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.getHistory();
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // console.log("Changes on menus", changes);
    if (changes['autoSave']) {
      this.saveAuto = changes['autoSave'].currentValue;
    }
    if (changes['keyStore']) {
      this.keyStore = changes['keyStore'].currentValue;
    }
    if (changes['search']) {
      this.searchUrl = changes['search'].currentValue;
    }
  }
  public getHistory() {
    const history = this.storage.getJsonItem(this.keyStore);
    if (history) {
      this.requestsHistory = history
    } else {
      this.requestsHistory = [];
    }
    // console.log(this.requestsHistory);
  }
  /**
   * Store the url in local storage
   * @param url string 
   */
  public storeHistory(keyStore:string,url: string) {
    console.log("(i) Save Request history");
    let history = this.storage.getJsonItem(keyStore);
    // console.log(history);
    if (history) {
      // Add only if the url isn't include in the history
      if (history.indexOf(url) === -1) {
        history.push(url);
      }
    } else {
      // Create a new history
      history = [];
      history.push(url);
    }
    this.storage.setJsonItem(keyStore, history);
    this.getHistory();
  }
  selectUrl() {
    if (this.saveAuto) {
      this.storeHistory(this.keyStore,this.searchUrl);
    }
    this.urlSelected.emit(this.searchUrl);
  }
  deleteItemHistory(){
    console.log("(i) Delete Request from history");
    let history = this.storage.getJsonItem(this.keyStore);
    // console.log(history);
    if (history) {
      const idx=history.indexOf(this.searchUrl);
      console.log("Founded",idx);
      if (idx>=0) {
        history.splice(idx, 1);
        this.storage.setJsonItem(this.keyStore, history);
        this.getHistory();
      }
    } 
  }
}
