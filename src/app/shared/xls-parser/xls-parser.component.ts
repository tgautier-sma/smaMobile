import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { ExcelService } from '../../services/excel.service';
import * as XLSX from 'xlsx';
import { WorkBook, WorkSheet, WritingOptions, read, utils, version } from 'xlsx';
import { FileUploadModule } from 'primeng/fileupload';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SharedService } from '../../services/shared.service';

type AOA = any[][];

@Component({
  selector: 'app-xls-parser',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToggleButtonModule, InputNumberModule, TabViewModule, TableModule, FormsModule],
  templateUrl: './xls-parser.component.html',
  styleUrls: ['./xls-parser.component.scss'],
  providers: [],
})
export class XlsParserComponent implements OnInit {
  wb!: WorkBook;
  ws!: WorkSheet;
  wsName!:string;
  sheets: any;
  display = false;
  data: AOA = [[], []];
  wopts: WritingOptions = { bookType: 'xlsx', type: 'array' };
  ver: string = version;
  loading: boolean = false;
  firstLine: boolean = true;
  headers: any = null; //for headings
  rows: any = null; // for rows
  rowsSize: any = null;  // for number of lines
  file!: any;
  headerLineNumber: any = 1;                                 // Line number for header information

  @Input() reset!: boolean;
  @Output() selectedFile: EventEmitter<any> = new EventEmitter(); // event when the current item is selectd
  @ViewChild('fileXls') fileUpload: any; // acces to html element file upload component

  constructor(private primengConfig: PrimeNGConfig, private excelService:ExcelService,  private shared: SharedService,) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
  //File upload function
  onFileSelected(event: any) {
    this.loading = true;
    this.file = event.files[0];
    var reader = new FileReader();
    reader.onload = (e: any) => {
      var data = e.target.result;
      this.wb = XLSX.read(data);
      console.log("(i) Current Workbook", this.wb);
      this.sheets = this.wb.SheetNames;
      this.wsName = this.sheets[0];
      this.display = true;
      this.displaySh(this.wsName);
      this.loading = false;
    };
    reader.readAsArrayBuffer(this.file);
  }
  handleChange(e: any) {
    var index = e.index;
    this.wsName = this.sheets[index];
    console.log("Read sheet ", this.wsName);
    this.displaySh(this.wsName);
  }
  displaySh(wsname: string) {
    /* grab first sheet */
    // console.log("(i) Get data from sheet : ", wsname);
    this.loading = true;
    this.ws = this.wb.Sheets[wsname];
    this.data = [[], []];
    this.data = <AOA>(utils.sheet_to_json(this.ws, { header: 1 }));
    if (this.data.length > 1) {
      // console.log("(i) Sheet data ", this.data);
      this.rows = this.data;
      this.rowsSize = this.rows.length;     // number of row
      // console.log("(i) Sheet header row : ", this.headerLineNumber);
      this.headers = [];
      if (this.headerLineNumber >= 1) {
        this.rows[this.headerLineNumber - 1].forEach((elt: string) => {
          this.headers.push(this.excelService.normalizeColumnName(elt));
        });
      }
    }
    this.loading = false;
  }
  sendData(event: any) {
    // console.log("Send data rows to Server", this.rows, this.headers, event);
    const d: any = utils.sheet_to_json(this.ws, { header: this.headers, blankrows: false, defval: "" });
    if (this.firstLine) {
      for (let index = 1; index <= this.headerLineNumber; index++) {
        const shifted = d.shift();
      }
      this.rowsSize = d.length;
    }
    // Apply standard column name without specials caracters et duplicate _
    d.forEach((elt: { [x: string]: any; }) => {
      for (const key in elt) {
        if (Object.prototype.hasOwnProperty.call(elt, key)) {
          const newCol=this.excelService.normalizeColumnName(key);
          if (key!=newCol){
            elt[newCol] = elt[key];
            delete elt[key];
          }
        }
      }
    });
    this.selectedFile.emit({ 
      file: this.file, 
      wb: this.wb, 
      wsName: this.wsName,
      headers: this.headers, 
      headerLineNumber:this.headerLineNumber,
      rows: d, 
      count: this.rowsSize, 
      

    });
    this.shared
  }
  clearData(event: any) {
    this.data = [[], []];
    this.display = false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    for (let propName in changes) {
      if (propName === "reset") {
        let chng = changes[propName];
        if (chng.currentValue === true) {
          if (this.fileUpload) {
            this.fileUpload.clear();
          }
        }
      }
    }
  }
}

