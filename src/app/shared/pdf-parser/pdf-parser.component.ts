import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { jsPDF } from "jspdf";
import { PDFProgressData, PdfViewerModule } from 'ng2-pdf-viewer';

import { AccordionModule } from 'primeng/accordion';
import { PrimeNGConfig, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-pdf-parser',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, AccordionModule, ToastModule, FileUploadModule,
    InputGroupModule, InputTextModule, NgxJsonViewerModule, FormsModule,
    EditorModule, PdfViewerModule
  ],
  templateUrl: './pdf-parser.component.html',
  styleUrl: './pdf-parser.component.scss',
  providers: [MessageService]
})
export class PdfParserComponent {
  display = false;
  loading = false;
  file!: any;
  pdfSrc: any;
  data!: any;
  jsonData!: any;
  jsonFormat = false;
  text: string | undefined;
  // selectedPath: any = "model.organizations[0].item";
  @Input() reset!: boolean;
  @Input() selectedPath!: any;
  @Output() selectedData: EventEmitter<any> = new EventEmitter(); // event when the current item is selectd
  @ViewChild('fileText') fileUpload: any; // acces to html element file upload component  fileText:
  constructor(private primengConfig: PrimeNGConfig, private messageService: MessageService,) { }

  ngOnInit(): void { }
  onFileSelected(event: any) {
    this.loading = true;
    this.file = event.files[0];
    var reader = new FileReader();
    reader.onload = (e: any) => {
      console.log("File selected", e)
      this.data = e.target.result;
      this.loading = false;
    };
    reader.readAsArrayBuffer(this.file);
  }
  onProgress(progressData: any) {
    console.log("Progress event", progressData);
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
  clearData(event: any) {
  }
  copyToEnded(event: any) {
    this.messageService.add({ severity: 'success', summary: 'Copy to Clipboard', detail: 'données copiées.', life: 1000 });
  }
  sendData(event: any) {
    // console.log(this.data);
    const exp = { file: this.file, path: "", data: this.data }
    this.selectedData.emit(exp);
  }
}
