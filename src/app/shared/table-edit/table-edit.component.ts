import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Table, TableModule } from 'primeng/table';
import { ExcelService } from '../../services/excel.service';
import { SharedService } from '../../services/shared.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { GetPropertiePipe } from '../../pipes/json-transform.pipe';
import { PipesModule } from '../../pipes/pipes.module';

@Component({
  selector: 'app-table-edit',
  templateUrl: './table-edit.component.html',
  styleUrls: ['./table-edit.component.scss'],
  providers: [GetPropertiePipe],
  standalone: true,
  imports: [CommonModule, ClipboardModule,
    ButtonModule, ToastModule, FormsModule, TabViewModule,
    AccordionModule, TableModule, SplitButtonModule, OverlayPanelModule,
    InputGroupModule, InputGroupAddonModule, InputTextModule, CheckboxModule, DialogModule,
    PipesModule, NgxJsonViewerModule]
})
export class TableEditComponent {
  @Input() items!: Array<any>                         // Items to viexw/modify
  @Input() cols!: Array<any>                          // List à column to display
  @Input() model!: any                                // Model for fields definition
  @Input() loading: boolean = false
  @Input() filter: boolean = false
  @Input() sort: boolean = false
  @Input() deleteData: boolean = false                // if true, an icon is show for delete on each column
  @Output() updated: EventEmitter<any> = new EventEmitter();

  @ViewChild('dt') dt!: Table;                        // Table contain data to update
  @ViewChild('uv') uv!: OverlayPanel;                 // Display unique value
  @ViewChild('rv') rv!: OverlayPanel;                 // Display refvalue
  @ViewChild('newCol') newCol!: OverlayPanel;         // Display newcol name input

  ref: DynamicDialogRef | undefined;

  tableItems!: any;
  colsFilter!: any;
  dataModel!: any;
  overlayUV: boolean = false;                         // Is true show the overlay panel
  fileUrl!: any;                                      // URL for file download result
  exportReady = false;                                // if true, the file is generated, and ready to export
  countFilter!: number;                               // Count filtered data from table
  count!: number;                                     // Total count of row from table
  delCol: boolean = false;                            // if true, an icon is show for delete on each column
  uniqueValues: Array<string> = ['']                  // List of unique value from a field
  refValues: Array<string> = ['']                  // List of unique value from a field
  selectedValue!: string;
  currentRow!: any;
  currentField: string = "";
  newColName: string = "";
  constructor(
    private messageService: MessageService,
    private sharedService: SharedService,
    private excelService: ExcelService,
    public dialogService: DialogService,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log("Table edit changes", changes);
    if (changes['cols'] && changes['cols'].currentValue) {
      this.cols = changes['cols'].currentValue;
      this.colsFilter = this.cols.map((d) => { return d; });
      // console.log(this.cols);
    }
    if (changes['model'] && changes['model'].currentValue) {
      this.dataModel = changes['model'].currentValue;
    }
    if (changes['items'] && changes['items'].currentValue) {
      this.tableItems = changes['items'].currentValue;
      this.count = this.tableItems.length;
    }
    if (changes['filter'] && changes['filter'].currentValue) {
      this.filter = changes['filter'].currentValue;
    }
    if (changes['sort'] && changes['sort'].currentValue) {
      this.filter = changes['sort'].currentValue;
    }
  }
  /**
   * Filter anywhere in the table
   * @param event event from search field, contain the value to search
   */
  filterData(event: any) {
    this.dt.filterGlobal(event.target.value, 'contains');
    setTimeout(() => {
      this.countFilter = this.dt.filteredValue ? this.dt.filteredValue.length : 0;
    }, 500);
  }
  /**
   * Clear the table Component
   * @param table 
   */
  clear(table: Table) {
    table.clear();
  }
  /**
   * Read all unique data from the field
   * @param item 
   */
  distinctRecords(xmlItem: any, prop: string) {
    this.currentRow = xmlItem;
    this.currentField = prop;
    let unique_values = this.items
      .map((elt: any) => elt[prop])
      .filter(
        (value: any, index: any, current_value: any) => current_value.indexOf(value) === index
      );
    // console.log(unique_values);
    // Eliminate undefinded value
    this.uniqueValues = [];
    unique_values.forEach((elt: any) => {
      if (elt !== undefined) {
        elt = (elt == '' ? ' ' : elt);
        this.uniqueValues.push(elt.trim());
      }
    });
    this.uniqueValues = Array.from(this.uniqueValues).sort();
    // this.uniqueValues.sort();
    // this.overlayUV = true;
    // this.uv.show({});
    // item.comment=JSON.stringify(unique_values);
  }
  onValueSelect(event: any, op: OverlayPanel) {
    // console.log(event);
    this.currentRow[this.currentField] = event.data.trim();
    // this.messageService.add({ severity: 'info', summary: 'Item Selected', detail: event.data });
    this.currentRow = null;
    this.currentField = "";
    op.hide();
  }
  /**
   * Add a new column with name
   * @param name 
   */
  addCol(name: string) {
    if (name) {
      this.items.forEach((element: { [x: string]: string; }) => {
        element[name] = "";
      });
      this.cols.push(name)
    }
    this.newCol.hide();
  }
  /**
   * Delete the colomn identifed by field name
   * @param field 
   */
  deleteCol(field: any) {
    var filteredArray = this.cols.filter(function (e) { return e !== field })
    this.cols = filteredArray;
    this.items.forEach((elt: any[]) => {
      delete elt[field]
    });
  }
  /**
   * Delete Row identied by index number from 0
   * @param idx 
   */
  deleteRow(idx: any) {
    this.items.splice(idx, 1);
  }

  saveData() {
    this.updated.emit({ headers: this.cols, rows: this.items });
  }
  getModel(field: string) {
    return this.dataModel.find((elt: any) => elt.field === field);
  }
  getModelEnum(xmlItem: any, field: string) {
    this.currentRow = xmlItem;
    this.currentField = field;
    const f = this.dataModel.find((elt: any) => elt.field === field);
    this.refValues = JSON.parse(f.enum);
  }
  getModelValue(field: any, search: any) {
    if (search !== undefined) {
      const f = this.dataModel.find((elt: any) => elt.field === field);
      const r = JSON.parse(f.enum);
      const rr = r.find((elt: any) => elt.value === search);
      if (rr !== undefined) {
        return rr.label;
      } else {
        return ''
      }
    } else {
      return '';
    }

  }
  onRefValueSelect(event: any, op: OverlayPanel) {
    //console.log(event);
    this.currentRow[this.currentField] = event.data.value;
    // this.messageService.add({ severity: 'info', summary: 'Item Selected', detail: event.data });
    this.currentRow = null;
    this.currentField = "";
    op.hide();
  }
}
