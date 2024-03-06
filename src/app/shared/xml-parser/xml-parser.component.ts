import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import * as XLSX from 'xlsx';
import { json2csv } from 'json-2-csv';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { FormsModule } from '@angular/forms';
export class Item {
  categorie!: string;
  item!: string;
  doc!: string
}

@Component({
  selector: 'app-xml-parser',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, AccordionModule, ToastModule, FileUploadModule,
    InputGroupModule, InputTextModule, NgxJsonViewerModule, FormsModule
  ],
  templateUrl: './xml-parser.component.html',
  styleUrl: './xml-parser.component.scss',
  providers: [MessageService]
})
export class XmlParserComponent implements OnInit {
  display = false;
  loading = false;
  file!: any;
  data!: any;
  dataExp!: Array<Item>;
  xml!: any;
  // selectedPath: any = "model.organizations[0].item";
  @Input() reset!: boolean;
  @Input() selectedPath!: any;
  @Output() selectedData: EventEmitter<any> = new EventEmitter(); // event when the current item is selectd
  @ViewChild('fileTxt') fileUpload: any; // acces to html element file upload component  fileXml:
  constructor(private primengConfig: PrimeNGConfig, private messageService: MessageService,) { }

  ngOnInit(): void {}

  clearData(event: any) {
    this.display = false;
    this.xml = null;
    this.data = null;
  }
  onFileSelected(event: any) {
    this.loading = true;
    this.file = event.files[0];
    var reader = new FileReader();
    reader.onload = (e: any) => {
      // console.log(e)
      const buffer = e.target.result;
      const options = {
        ignoreAttributes: false
      };
      const parser = new XMLParser(options);
      this.xml = parser.parse(buffer);
      // console.log(this.xml);
      this.data = this.xml;
      this.display = true;
      this.loading = false;
      const content = this.data;
      this.applyPath();
    };
    reader.readAsText(this.file);
  }
  applyPath() {
    // Apply the path to access data
    const s = this.selectedPath.split('.');
    let x = this.xml;
    try {
      s.forEach((element: any) => {
        element = element.trim();
        if (element.includes("[")) {
          const b = element.split('[')
          const c = b[1].split(']');
          x = x[b[0]];
          const idx = +c[0];
          x = x[idx];
        } else {
          x = x[element];
        }
      });
      // console.log("XML filter",x);
      this.data = x;
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Lecture des données', detail: 'Chemin d\'accés non valide.', life: 1000 });
    }
   
  }
  resetPath() {
    this.data = this.xml;
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("XML data receive : ",changes);
    for (let propName in changes) {
      if (propName === "reset") {
        let chng = changes[propName];
        if (chng.currentValue === true) {
          if (this.fileUpload) {
            this.fileUpload.clear();
          }
        }
      } 
      if (propName==='selectedPath'){
        this.selectedPath=changes['selectedPath'].currentValue;
      }
    }
  }
  copyToEnded(event: any) {
    this.messageService.add({ severity: 'success', summary: 'Copy to Clipboard', detail: 'données copiées.', life: 1000 });
  }
  sendData(event: any) {
    // console.log(this.data);
    const exp={file:this.xml,path:this.selectedPath, data:this.data}
    this.selectedData.emit(exp);
  }
  checkArray(elt: any) {
    return Array.isArray(elt);
  }
  getDataFromTable() {
    const elt = document.getElementById('tableResult');
    return elt?.innerHTML || "No data";
  }
  export() {
    let rows = [];
    for (let index = 0; index < this.data.length; index++) {
      const L1 = this.data[index];
      if (this.checkArray(L1.item)) {
        L1.item.forEach((L2: { item: any[]; label: any; }) => {
          if (this.checkArray(L2.item)) {
            L2.item.forEach(L3 => {
              const row = [];
              row.push(L1.label)
              row.push(L2.label)
              row.push(L3.label)
              row.push(L3.documentation);
              rows.push(row);
            });
          }
          else {
            const row = [];
            row.push(L1.label)
            row.push(L2.label)
            row.push("#NA")
            row.push("#NA");
            rows.push(row);
          }
        });
      } else {
        const row = [];
        row.push(L1.label)
        row.push("#NA")
        row.push("#NA")
        row.push("#NA");
        rows.push(row);
      }
    }
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.table_to_sheet(document.getElementById('tableResult'));
    var ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, 'test.xlsx');
  }
}
