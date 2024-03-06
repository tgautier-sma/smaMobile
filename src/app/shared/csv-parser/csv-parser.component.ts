import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CsvToJsonPipe } from '../../pipes/json-transform.pipe';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

const delimitersRef = [
  { name: 'Point Virgule', code: ';' },
  { name: 'Virgule', code: ',' },
  { name: 'Diese', code: '#' }
]

@Component({
  selector: 'app-csv-parser',
  standalone: true,
  imports: [CommonModule, FileUploadModule, DropdownModule, TableModule, FormsModule, ClipboardModule,InputTextModule],
  templateUrl: './csv-parser.component.html',
  styleUrls: ['./csv-parser.component.scss'],
  providers: [CsvToJsonPipe]
})
export class CsvParserComponent implements OnInit {
  headers: any = null; //for headings
  rows: any = null; // for rows
  rowsSize: any = null;  // for number of lines
  delimiter: any = ",";
  delimiterString = '"';
  delimiters: any = delimitersRef;
  fileInput!: any;
  fileCsv!: any;
  display = false;
  @Input() reset!: boolean;
  @Output() selectedFile: EventEmitter<any> = new EventEmitter(); // event when the current item is selectd
  @ViewChild('fileCsv') fileUpload: any; // acces to html element file upload component
  constructor(private csvToJson: CsvToJsonPipe) { }

  ngOnInit(): void {

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
  //File upload function
  onFileSelected(event: any) {
    const file: File = event.files[0];
    if (file) {
      this.fileCsv = file;
      console.log("(i) CSV File to import", file.name, file.size, file.type);
      console.log("(i) File", this.fileCsv);
      this.readCsvData()
    }
  }
  readCsvData() {
    //File reader method
    // console.log('Read csv file',this.fileCsv);
    // console.log('Delimiter',this.delimiter);
    if (this.fileCsv) {
      let reader: FileReader = new FileReader();
      reader.readAsText(this.fileCsv);
      reader.onload = (e) => {
        let csv: any = reader.result;
        this.rows = this.csvToJson.transform(csv, this.delimiter);        // Convert  function
        this.rows.forEach((obj: { [x: string]: any; }) => {
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              let s = key.replace(/\s/g, '_')
              s = s.replace(/\./g, '_');
              renameKey(obj, key, s)
            }
          }
        });
        this.rowsSize = this.rows.length;                                 // number of row
        this.headers = Object.getOwnPropertyNames(this.rows[0]);          // Calculate Header
        this.display = true;
      }
    }

  }
  sendData(event: any) {
    // console.log("Send data rows to Server", this.rows, event);
    this.selectedFile.emit({
      file: this.fileCsv,
      wb: null, wsName: null,
      headers: this.headers, rows: this.rows,
      count: this.rowsSize
    });
  }
  clearData(event: any) {
    this.headers = null;
    this.rows = null;
    this.rowsSize = null;
  }
  getJsonData(): string {
    return JSON.stringify(this.rows)
  }
  
}

function renameKey(obj: { [x: string]: any; }, oldKey: string | number, newKey: string | number) {
  if (newKey != oldKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
}