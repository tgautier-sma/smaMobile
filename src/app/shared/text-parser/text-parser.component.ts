import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AccordionModule } from 'primeng/accordion';
import { PrimeNGConfig, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Item } from '../xml-parser/xml-parser.component';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-text-parser',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, AccordionModule, ToastModule, FileUploadModule,
    InputGroupModule, InputTextModule, NgxJsonViewerModule, FormsModule,
    EditorModule
  ],
  templateUrl: './text-parser.component.html',
  styleUrl: './text-parser.component.scss',
  providers: [MessageService]
})
export class TextParserComponent {
  display = false;
  loading = false;
  file!: any;
  data!: any;
  jsonData!: any;
  jsonFormat=false;
  text: string | undefined;
  // selectedPath: any = "model.organizations[0].item";
  @Input() reset!: boolean;
  @Input() selectedPath!: any;
  @Output() selectedData: EventEmitter<any> = new EventEmitter(); // event when the current item is selectd
  @ViewChild('fileText') fileUpload: any; // acces to html element file upload component  fileText:
  constructor(private primengConfig: PrimeNGConfig, private messageService: MessageService,) { }

  ngOnInit(): void { }

  clearData(event: any) {
    this.display = false;
    this.jsonData = null;
    this.data = null;
  }
  onFileSelected(event: any) {
    this.loading = true;
    this.file = event.files[0];
    var reader = new FileReader();
    reader.onload = (e: any) => {
      console.log(e)
      const buffer = e.target.result;
      try {
        this.data = JSON.parse(buffer);
        this.jsonData=JSON.parse(buffer);
        this.jsonFormat=true;
        this.display = true;  
      } catch{
        this.data=buffer;
        this.text=buffer;
        this.jsonFormat=false;
        this.display = true;
      }
      this.loading = false;
    };
    reader.readAsText(this.file);
  }
  applyPath() {
    // Apply the path to access data
    const s = this.selectedPath.split('.');
    let x = this.data;
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
      // console.log("jsonData filter",x);
      this.data = x;
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Lecture des données', detail: 'Chemin d\'accés non valide.', life: 1000 });
    }

  }
  resetPath() {
    this.data = this.jsonData;
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(changes);
    for (let propName in changes) {
      if (propName === "reset") {
        let chng = changes[propName];
        if (chng.currentValue === true) {
          if (this.fileUpload) {
            this.fileUpload.clear();
          }
        }
      }
      if (propName === 'selectedPath') {
        this.selectedPath = changes['selectedPath'].currentValue;
      }
    }
  }
  copyToEnded(event: any) {
    this.messageService.add({ severity: 'success', summary: 'Copy to Clipboard', detail: 'données copiées.', life: 1000 });
  }
  sendData(event: any) {
    // console.log(this.data);
    const exp = { file: this.jsonData, path: this.selectedPath, data: this.data }
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
    }
  }
}
