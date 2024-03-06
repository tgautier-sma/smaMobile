import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { RequesterService } from '../../services/requester.service';
import { RequestSelectComponent } from '../request-select/request-select.component';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-media-nasa',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule, AccordionModule, ToastModule, FileUploadModule, ImageModule, TooltipModule, CarouselModule,
    InputGroupModule, InputTextModule, NgxJsonViewerModule, FormsModule, CardModule, GalleriaModule,
    FileUploadModule, TabViewModule, SliderModule, InputNumberModule,
    TagModule,
    RequestSelectComponent
  ],
  templateUrl: './media-nasa.component.html',
  styleUrl: './media-nasa.component.scss',
  providers: [RequestSelectComponent]
})
export class MediaNasaComponent {
  keyStore = "sma-exp_nasa";
  search = "moon";
  medias = [];
  currentMedias: any = [];
  totalItems = 0;
  displayCustom: boolean = false;
  activeIndex: number = 0;
  responsiveOptions: any[] = [
    { breakpoint: '1500px', numVisible: 5 },
    { breakpoint: '1024px', numVisible: 3 },
    { breakpoint: '768px', numVisible: 2 },
    { breakpoint: '560px', numVisible: 1 }
  ];

  constructor(
    private messageService: MessageService,
    private request: RequesterService,
    private RequestSelect: RequestSelectComponent,
    private sanitizer: DomSanitizer,
  ) { }
  getData(search: string) {
    const url = `https://images-api.nasa.gov/search?q=${search}`;
    this.request.getFullRequest(url, 'json').subscribe((response: any) => {
      console.log(response);
      this.medias = response.collection.items;
      this.totalItems = response.collection.metadata.total_hits;
      this.search = search;
      this.RequestSelect.storeHistory(this.keyStore, search);
      this.RequestSelect.getHistory();
    }, (error: any) => {
      console.log("(e) Request rejected", error);
      this.messageService.add({ severity: 'error', summary: 'Requete rejetée.', detail: error });
    })
  }
  getMediaData(item: any) {
    const url = item.href;
    this.currentMedias = [];
    this.request.getFullRequest(url, 'json').subscribe((response: any) => {
      // console.log(response);
      let temp:any=[]
      response.forEach((element: any) => {
        const idx = element.lastIndexOf(".")
        const ext = element.substr(idx).trim();
        // console.log(ext, ext.length);
        let type = "";
        switch (ext) {
          case ".mp4":
            type = "video";
            // this.currentMedias.push({ url: element, type: type });
            break;
          case ".srt":
            type = "text";
            break;
          case ".json":
            type = "json";
            break;
          default:
            type = "image"
            temp.push({ url: element, type: type });
            break;
        }
      });
      this.currentMedias=temp;
      this.displayCustom = true;
      console.log(this.currentMedias);
    }, (error: any) => {
      console.log("(e) Request rejected", error);
      this.displayCustom = false;
      this.messageService.add({ severity: 'error', summary: 'Requete rejetée.', detail: error });
    });
  }
  getText(url: any) {
    let ret="No text";
    if (this.displayCustom) {
      this.request.getFullRequest(url, 'html').subscribe((response: any) => {
        console.log(response);
        ret=response;
      }, (error: any) => {
        console.log(error);
        ret="error";
      });
    } 
    return ret; 
  }
  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }
}
