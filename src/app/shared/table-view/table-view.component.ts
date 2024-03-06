import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
// Exernal modules
import * as XLSX from 'xlsx';
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import { FileSaverService } from 'ngx-filesaver';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
// Pipes
import { GroupByPipe } from '../../pipes/group-by.pipe';
import { CountPropertiePipe } from '../../pipes/json-transform.pipe';
import { GetPropertiePipe } from '../../pipes/json-transform.pipe';
import { PipesModule } from '../../pipes/pipes.module'
import { EventEmitterService } from '../../services/event-emitter.service';
// PrimeNg Modules
import { Table, TableModule } from 'primeng/table';
import { MenuItem, MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// Field definition for a table
export class TableColDef {
  code: string = "";
  label: string = "";
  type: string = "text";
  link: boolean = false;
  linkField: string = "";
  linkUrl: string = "";
}
// Pagination object data, shared with the parent component
export class Pagination {
  page: any;
  pageSize: any;
  pageCount: any;
  total: any
}

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
  providers: [GetPropertiePipe, GroupByPipe, CountPropertiePipe],
  standalone: true,
  imports: [
    CommonModule, ClipboardModule,
    ButtonModule, FormsModule, TabViewModule,
    AccordionModule, TableModule,
    ToastModule, SplitButtonModule, OverlayPanelModule, ConfirmDialogModule,
    InputGroupModule, InputGroupAddonModule, InputTextModule, CheckboxModule, TagModule, InputSwitchModule,
    DialogModule, ContextMenuModule, DynamicDialogModule,
    PipesModule, NgxJsonViewerModule
  ]
})

export class TableViewComponent implements OnInit, OnChanges {
  tableItems!: any;           // Data display on table
  selectedItems!: any;        // Data items selected on table
  selectedItemIdx!: any;      // Index of selected item
  filtersItem!: any;          // Filtered item
  editedItem!: any;           // Current edited item
  dataModel!: any;            // Array of field definition, used for input form
  count!: number;             // Tables items count
  colsFilter!: any;           // Array of column to search/filter
  countFilter!: number;       // Filter table count result
  stats: any;
  search = '';
  saveFiltered = false;

  editMode=false;         // Mode edition ou non
  editVisible = false;        // flag to view the modif dialog
  countVisible = false;   // flag to viex the count dialog
  menus!: MenuItem[];     // OPtion for menu on right click table
  rowEdited = false;      // Flag to indicate if a edit action or detail action actived
  submitted = false;      // Flag to indicate if the modif form is submitted
  
  recordVisible=false     // Detail dialog flag
  /**
   * Component input 
   */
  @Input() items!: Array<any>           // Data to display
  @Input() cols!: Array<TableColDef>    // Array of column definition
  @Input() loading: boolean = false     // Flag to indicate if data are loading or calculating
  @Input() filter: boolean = false      // Flag to activate filter functions
  @Input() sort: boolean = false        // Flag to active columns sort options
  @Input() pagination!: Pagination      // All data needed for pagination
  @Input() searchItems!: Array<any>     // Selected items 
  /**
   * Component emitter, for returning infos
   */
  @Output() newLink: EventEmitter<any> = new EventEmitter();          // New Link to open, if a link exist on table
  @Output() previousItems: EventEmitter<any> = new EventEmitter();    // Event to parent, to call previous dataset
  @Output() nextItems: EventEmitter<any> = new EventEmitter();        // Event to parent, to call next dataset
  @Output() itemsSelected: EventEmitter<any> = new EventEmitter();    // Event to parent, for items selected

  @ViewChild('dt', { static: false }) dt!: Table;   // Access to table html component

  constructor(
    private FSService: FileSaverService,
    private event: EventEmitterService,
    private fb: FormBuilder,
    private getPropertie: GetPropertiePipe,
    private countPropertie: CountPropertiePipe,
    private messageService: MessageService,
    private groupBy: GroupByPipe) { }

  ngOnInit(): void {
    this.event.dataEmitter.subscribe(data => {
      // console.log("Tableview data received", data);
      if ('loading' in data) {
        this.loading = data.loading;
      }
    });
    this.menus = [
      { label: 'Détail...', icon: 'pi pi-fw pi-search', command: () => this.viewRow(this.selectedItems) },
      { label: 'Compter...', icon: 'pi pi-fw pi-times', command: () => this.countByField() }
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("Changes Table view", changes);
    if (changes['items'] && changes['items'].currentValue) {
      this.tableItems = changes['items'].currentValue;
      this.count = this.tableItems.length;
    }
    if (changes['cols'] && changes['cols'].currentValue) {
      this.cols = changes['cols'].currentValue;
      this.colsFilter = this.cols.map((d) => { return d.code; });
      // console.log(this.cols);
    }
    if (changes['filter'] && changes['filter'].currentValue) {
      this.filter = changes['filter'].currentValue;
    }
    if (changes['sort'] && changes['sort'].currentValue) {
      this.filter = changes['sort'].currentValue;
    }
    if (changes['pagination'] && changes['pagination'].currentValue) {
      this.filter = changes['pagination'].currentValue;
    }
    if (changes.hasOwnProperty('searchItems') && changes['searchItems'].currentValue) {
      const ch = changes['searchItems'].currentValue;
      this.selectedItems = ch;
    } else {
      this.selectedItems = [];
    }
  }
  prev() {
    this.previousItems.emit({ "action": 'prev' });
  }
  next() {
    this.nextItems.emit({ "action": 'next' });
  }
  clear(table: Table) {
    table.clear();
    this.filtersItem = null;
    this.countFilter = 0;
  }
  getValue(rowData: any, col: string) {
    return this.getPropertie.transform(rowData, col);
  }
  // Filter Table with the contains of column
  setFilter(text: any) {
    this.search = text;
    this.filterData(this.search);
    this.countVisible = false;
  }
  filterData(search: any) {
    this.dt.filterGlobal(search, 'contains');
    setTimeout(() => {
      this.countFilter = this.dt.filteredValue ? this.dt.filteredValue.length : 0;
    }, 500);
  }
  onFilter(event: any) {
    // console.log(event);
    this.filtersItem = event.filteredValue;
    this.countFilter = this.filtersItem.length;
  }

  showRecord(idx: any) {
    this.editedItem = this.tableItems[idx];
    this.recordVisible = !this.recordVisible;
  }
  countByField() {
    // Get Array of field value;
    const listField = this.cols.map(col => {
      return { "name": col.code, "title": col.label, "type": col.type }
    });
    // console.log("Fields", listField);
    this.stats = this.groupBy.transform(this.filtersItem ? this.filtersItem : this.tableItems, listField);
    this.countVisible = true;
  }

  defineUrl(url: string, data: any, varName: string) {
    return url.replace(`##${varName}##`, data[varName]);
  }
  navigateItem(idx: any, item: any, col: any) {
    if (col.link) {
      const value = this.getValue(item, col.linkField);
      this.newLink.emit({ item: item, col: col, value: value });
    }
  }

  /**
   * Row edit, save or cancel
   */
  onSelectAll(event:any){
    console.log("Select All",event);
    this.itemsSelected.emit(this.selectedItems);
  }
  onRowSelect(event: any) {
    // console.log("Select event   : ", event);
    // console.log("Table Items selected : ", this.selectedItems);
    if (this.editMode){
      this.selectedItemIdx = event.index;
      this.editedItem=event.data;
      this.viewRow(event.data);
      this.rowEdited = true;
    }
    this.itemsSelected.emit(this.selectedItems);
  }
  onRowUnSelect(event:any){
    this.itemsSelected.emit(this.selectedItems);
  }
  viewRow(item: any) {
    if (item) {
      this.dataModel = [];
      for (const key in item) {
        // if (Object.prototype.hasOwnProperty.call(item, key)) {
        if (item.hasOwnProperty(key)) {
          const element = item[key];
          if (!isJsonObject(element)) {
            const name = key.replace(/ /g, '_');
            this.dataModel.push({ id: key, name: key, label: key, type: 'text', help: 'Veuillez saisir une donnée.' });
          }
        }
      }
      this.editVisible = true;
    } else {
      this.editVisible = false;
    }
  }
  saveModif() {
    // console.log("Data to update", this.editedItem);
    // console.log("Data origin Index", this.selectedItemIdx);
    // console.log("Data origin", this.tableItems[this.selectedItemIdx]);
    this.tableItems[this.selectedItemIdx] = { ...this.editedItem };
    this.dt.reset();
    console.log("Data modified", this.tableItems);
    this.editVisible = false;
    this.rowEdited = false;
  }
  cancelModif() {
    this.editVisible = false;
    this.rowEdited = false;
    this.selectedItems = [];
  }
  copyToEnded(event: any) {
    this.messageService.add({ severity: 'success', summary: 'Copy to Clipboard', detail: 'données copiées.', life: 1000 });
  }
  getName(str: string) {
    return str.replace(/ /g, '_');
  }

  /**
  * Data export
  */
  exportExcel() {
    console.log("Save data to Excel", this.cols);
    const cols: any[] = []
    this.cols.forEach(element => {
      cols.push(element.code);
    });
    /* generate worksheet */
    const dExport = (this.saveFiltered ? this.selectedItems : this.items);
    if (dExport) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dExport, { header: cols });
      let wsRef = XLSX.utils.json_to_sheet(this.cols);
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      /* save to file */
      const dt = new Date();
      const fn = "export_" + dt.toISOString() + ".xlsx";
      XLSX.writeFile(wb, fn);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Export vers Excel', detail: 'Aucune données à exporter', life: 1000 });
    }
  }
  exportCsv() {
    const cols: any[] = []
    this.cols.forEach(element => {
      cols.push(element.code);
    });
    const dataExport: string[] = [];
    dataExport.push(cols.join(";"));
    const dExport = (this.saveFiltered ? this.selectedItems : this.items);
    if (dExport) {
      dExport.forEach((element: any) => {
        const d = element.join(";");
        dataExport.push(d);
      });
      const dt = new Date();
      const fn = "export_" + dt.toISOString() + ".csv";
      downloadCSVFile(dataExport.join("\n"), fn);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Export CSV', detail: 'Aucune données à exporter', life: 1000 });
    }
  }
  exportJson() {
    const dExport = (this.saveFiltered ? this.selectedItems : this.items);
    if (dExport) {
      const j = { date: new Date, count: dExport.length, columns: this.cols, rows: dExport };
      const dt = new Date();
      const fn = "export_" + dt.toISOString() + ".json";
      this.FSService.saveText(JSON.stringify(j), fn);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Export JSON', detail: 'Aucune données à exporter', life: 1000 });
    }

  }
  exportXML() {
    const dExport = (this.saveFiltered ? this.selectedItems : this.items);
    if (dExport) {
      const options = {
        ignoreAttributes: false
      };
      const builder = new XMLBuilder(options);
      let xmlDataStr = builder.build(dExport);
      const event = new Date();
      this.FSService.saveText(xmlDataStr, "export_" + event.toISOString() + ".xml");
    } else {
      this.messageService.add({ severity: 'error', summary: 'Export XML', detail: 'Aucune données à exporter', life: 1000 });
    }

  }
}

function downloadCSVFile(csv: any, filename: string) {
  var csv_file, download_link;
  csv_file = new Blob([csv], { type: "text/csv" });
  download_link = document.createElement("a");
  download_link.download = filename;
  download_link.href = window.URL.createObjectURL(csv_file);
  download_link.style.display = "none";
  document.body.appendChild(download_link);
  download_link.click();
  download_link.remove();
}
function isJsonObject(strData:any) {
  return strData instanceof Object && strData.constructor === Object
 }

