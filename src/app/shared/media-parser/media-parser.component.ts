import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';

import { RequesterService } from '../../services/requester.service';

import { Carousel, CarouselModule } from 'primeng/carousel';
import { TabViewModule } from 'primeng/tabview';
import { SliderModule } from 'primeng/slider';
import { InputNumberModule } from 'primeng/inputnumber';
import { RequestSelectComponent } from '../request-select/request-select.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaNasaComponent } from '../media-nasa/media-nasa.component';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-media-parser',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule, AccordionModule, ToastModule, FileUploadModule, ImageModule, TooltipModule, CarouselModule,
    InputGroupModule, InputTextModule, NgxJsonViewerModule, FormsModule,
    FileUploadModule, TabViewModule, SliderModule, InputNumberModule,
    EditorModule, PdfViewerModule,
    RequestSelectComponent,MediaNasaComponent
  ],
  templateUrl: './media-parser.component.html',
  styleUrl: './media-parser.component.scss',
  providers: [MessageService, RequestSelectComponent]
})
export class MediaParserComponent {
  keyStore="sma-exp_urls";
  uploadedFiles: any[] = [];
  fileList: any[] = [];
  responsiveOptions: any[] | undefined;
  autoPlay: number = 0;
  mediaContent!: any;
  selected: any = [];
  selectedUrl!: string;
  refMediaLib!:any;
  activeIndex: number = 0;
  @ViewChild('car', { static: false }) car!: Carousel;   // Access to table html component

  constructor(
    private messageService: MessageService,
    private request: RequesterService,
    private RequestSelect: RequestSelectComponent,
    private sanitizer: DomSanitizer,
  ) { }
  ngOnInit() {
    this.responsiveOptions = [
      { breakpoint: '1400px', numVisible: 3, numScroll: 3 },
      { breakpoint: '1220px', numVisible: 2, numScroll: 2 },
      { breakpoint: '1100px', numVisible: 1, numScroll: 1 }
    ];
    this.refMediaLib=[
      {name:"",label:"",url:"",dataPath:"", imageUrl:""}
    ]
  }
  setAutoPlay() {
    if (this.autoPlay > 0) {
      this.car.stopAutoplay();
      this.car.allowAutoplay = true;
      this.car.autoplayInterval = this.autoPlay;
      this.car.startAutoplay();
    } else {
      this.car.allowAutoplay = false;
      this.car.autoplayInterval = this.autoPlay;
      this.car.stopAutoplay();
    }

  }
  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
  uploader(event: any) {
    console.log(event);
    this.request.uploadFiles(event.files).subscribe(response => {
      console.log(response);
      if (response.type === 4) {
        this.messageService.add({ severity: 'success', summary: 'Upload', detail: 'terminé' });
        //this.fileList=response.body;
      }
    }, error => {
      console.log({ "code": "ERR", "message": error });
      this.messageService.add({ severity: 'error', summary: 'Upload', detail: error });
    })
  }
  getUploadedFiles() {
    this.request.getUploaded().subscribe((response: any) => {
      console.log("Media from server", response);
      this.fileList = response;
      this.messageService.add({ severity: 'success', summary: 'Lecture des médias stockés sur le serveur.', detail: `${this.fileList.length} médias lus.` });
    }, (error: any) => {
      console.log({ "code": "ERR", "message": error });
      this.messageService.add({ severity: 'error', summary: 'Lecture des médias stockés sur le serveur.', detail: error });
    })
  }
  getMediaFromApi(url: string) {
    if (url.length >= 4) {
      this.mediaContent = null;
      this.request.getFullRequest(url, 'image').subscribe(
        (blob: any) => {
          console.log(blob);
          const reader = new FileReader();
          const binaryString = reader.readAsDataURL(blob);
          reader.onload = (event: any) => {
            //console.log('Image in Base64: ', event.target.result);
            this.mediaContent = event.target.result;
            this.selectedUrl = url;
            this.RequestSelect.storeHistory(this.keyStore,url);
          };
          reader.onerror = (event: any) => {
            console.log("File could not be read: " + event.target.error.code);
            this.messageService.add({ severity: 'error', summary: 'Impossible de lire le fichier.', detail: event.target.error.code });
          };
        }, (error: any) => {
          console.log("(e) Request rejected", error);
          this.messageService.add({ severity: 'error', summary: 'Requete rejetée.', detail: error });
        });
    } else {
      this.mediaContent = null;
      this.messageService.add({ severity: 'error', summary: 'Url incorrecte', detail: "" });
    }
  }
  getSafe(data: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(data);
  }
  selectImage() {
    console.log()
    this.selected.push({
      url: this.selectedUrl,
      data: this.mediaContent
    })
  }
}
// https://images-api.nasa.gov/search?q=moon