import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ApiService } from '../../services/api-service.service';
import { ExcelService } from '../../services/excel.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { environment } from '../../../environments/environment';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableViewComponent, TableColDef } from '../table-view/table-view.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { HistoryComponent } from '../history/history.component';

interface Column {
  field: string;
  header: string;
  type: string;
  size: number;
}

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule, FormsModule, TabViewModule,
    AccordionModule, TableModule, SplitButtonModule, OverlayPanelModule,
    InputGroupModule, InputGroupAddonModule, InputTextModule, DropdownModule, InputTextareaModule,
    NgxJsonViewerModule, TableViewComponent, HistoryComponent],
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
  providers: [MessageService]
})
export class RequestComponent {
  app = environment.appName;
  items: any[] | undefined;
  selectedItem: any;
  suggestions: any[] = [];
  url = "";
  response!: any;
  level: string = "data";
  cols: Array<TableColDef> = [];
  colsDef = [];
  rows: any = [];
  data: any = []
  headersRequest: any = [];
  headersData: any = null;
  temp!: any;
  activeTabRequest: number = 0;
  displayRequest = false;

  history: any = [];
  sortOptions!: SelectItem[];
  sortOrder!: number;
  sortField!: string;
  selectedHistory!: any;
  menuRequest!: MenuItem[];
  methodList = ["GET", "POST", "PUT", "DELETE"];
  methodSelected = "GET";
  requestBody = '{"name":"value","code":"value"}';

  @Input() requestUrl!: string           // url to use
  @ViewChild('rd') requestData!: Table

  constructor(private api: ApiService,
    private FSService: FileSaverService,
    private execlService: ExcelService,
    private localStorageService: LocalStorageService,
    private messageService: MessageService) {
    this.menuRequest = [
      {
        label: 'Refresh',
        icon: 'pi pi-refresh',
        command: () => {
          this.getHistory();
        }
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
        command: () => {
          this.deleteHistory();
        }
      },
      { label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io' },
      { separator: true },
      { label: 'Setup', icon: 'pi pi-cog', routerLink: ['/setup'] }
    ];
  }

  ngOnInit(): void {
    const last = this.localStorageService.getItem(this.app + "_last_url");
    this.url = last ? last : "";
    this.getHistory();
    this.sortOptions = [
      { label: 'Date desc', value: '!ts' },
      { label: 'Date asc', value: 'ts' }
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("Changes Table view", changes);
    if (changes['requestUrl'] && changes['requestUrl'].currentValue) {
      this.url = changes['requestUrl'].currentValue;
    }
  }
  /**
   * Read data form URL request
   * @param url complete URI for Internet request
   */
  getData(url: string) {
    this.api.full(this.methodSelected, url).subscribe(response => {
      // console.log(response);
      if (response.ok) {
        this.displayRequest = true;
        const requestKeys = response.headers.keys();
        this.headersRequest = requestKeys.map((key: any) => `${key}: ${response.headers.get(key)}`);
        // access the body directly, which is typed as `Config`.
        // this.data = { ...response.body! };
        this.data = response.body!;
        this.response = response;
        this.activeTabRequest = 1;
        this.getDataPath(this.level);
        this.localStorageService.setItem(this.app + "_last_url", url);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'exécution de la requete.', detail: response.toString() });
      }
    }, error => {
      console.log(error);
      this.response = null;
      this.headersRequest = [];
      this.data = [];
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error });
    });
  }
  /**
   * Read data array, from a a specific path
   * @param path path "name.name"
   */
  getDataPath(path: string) {
    let aData = this.data;
    if (path.length >= 1) {
      const aPath = path.split('.');
      // console.log("Path split . : ",aPath);
      for (let index = 0; index < aPath.length; index++) {
        if (aData.hasOwnProperty(aPath[index])) {
          const element = aData[aPath[index]];
          aData = element;
        }
      }
    }
    console.log("(i) Request Data is an array :", Array.isArray(aData));
    if (Array.isArray(aData)) {
      this.rows = [];
      aData.forEach(elt => {
        this.temp = {};
        // console.log(typeof elt, elt);
        if (typeof elt === 'object') {
          this.getAllVals(elt);
          for (const key in this.temp) {
            if (Object.prototype.hasOwnProperty.call(this.temp, key)) {
              let s = key.replace(/\s/g, '_')
              s = s.replace(/\./g, '_');
              s = s.replace(/\-/g, '_');
              renameKey(this.temp, key, s)
            }
          }
        } else {
          this.temp = { 'item': elt };
        }
        this.rows.push(this.temp);
      });
      this.headersData = Object.getOwnPropertyNames(this.rows[0]);          // Calculate Header for filter
      const cols = Object.keys(this.rows[0]);
      this.cols = [];
      cols.forEach((element: string) => {
        const ty = typeof this.rows[1][element];
        const typ: string = (ty == "undefined" ? "string" : ty);
        // this.cols.push({ field: element, header: element, type: (ty == "undefined" ? "string" : ty), size: 255 })
        this.cols.push({ code: element, label: element, type: typ, link: false, linkField: "", linkUrl: "" })
      });
    } else {
      this.rows = [];
      this.cols = [];
      this.headersData = [];
      this.messageService.add({ severity: 'error', summary: 'Veuillez choisir un chemin qui pointe sur un tableau', detail: "" });
    }
    // console.log("Table Columns",this.cols);
    // console.log("Header data", this.headersData);
    // console.log("Table Rows",this.rows);
  }

  /**
   * Read all properties in a deep level of JSON object
   * @param obj object to read
   */
  getAllVals(obj: any) {
    for (let k in obj) {
      if (typeof obj[k] === "object") {
        this.getAllVals(obj[k])
      } else {
        // base case, stop recurring
        this.temp[k] = obj[k];
      }
    }
  }

  clear(table: Table) {
    table.clear();
  }

  /** Export data to an Excel or a Json format */
  saveDataToXl() {
    this.execlService.export(this.rows, 'request.xlsx');
  }
  saveDataToJson() {
    this.FSService.saveText(JSON.stringify(this.rows), 'request.json');
  }
  saveRequestToJson() {
    this.FSService.saveText(JSON.stringify(this.response), 'request.json');
  }

  onSortChange(event: any) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  getHistory() {
    const hist = this.localStorageService.getJsonItem("requests");
    this.history = hist ? hist : [];
  }
  historyDisplay() {
    this.activeTabRequest = 2;
    this.displayRequest = true;
  }
  historyDelete(idx: any) {
    this.history.splice(idx, 1);
  }
  historyRun(item: any) {
    this.url = item.request;
    this.getData(this.url);
  }
  updateHistory() { }
  deleteHistory() {
    //console.log(this.selectedHistory);
    if (this.selectedHistory) {
      this.selectedHistory.forEach((element: any) => {
        // console.log(element);
        const index = this.history.indexOf(element);
        const x = this.history.splice(index, 1);
      });
      this.localStorageService.setJsonItem("requests", this.history);
    }
  }
  save(severity: string) {
    this.FSService.saveText(JSON.stringify(this.history), "history.json");
    this.messageService.add({ severity: severity, summary: 'Success', detail: 'Data Saved' });
  }
}

function renameKey(obj: { [x: string]: any; }, oldKey: string | number, newKey: string | number) {
  if (newKey != oldKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
}