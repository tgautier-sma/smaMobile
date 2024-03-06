import { Component, Input, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { RequesterService } from '../../services/requester.service';
import { EventEmitterService } from '../../services/event-emitter.service';
import { MessagesModule } from 'primeng/messages';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [
    CommonModule, 
    CarouselModule,CardModule, 
    ButtonModule, AccordionModule, ToastModule, FileUploadModule,
    InputGroupModule, InputTextModule, NgxJsonViewerModule, FormsModule
  ],
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.scss']
})
export class WeatherWidgetComponent implements OnInit {
  responsiveOptions!: any[];
  timerRefresh = 600; // second
  page = 0;
  storeName = "weather_List";
  city = "Paris,FR";
  cityAdd = "";
  cityList = [
    "Paris,FR",
    "Nassau,BS",
    "Madrid,ES",
    "Lisbonne,PT"
  ]
  citySelected = []
  cityResults = [];
  currentData: Array<any> = [];
  @Input() cities!:Array<string>;
  constructor(
    private messageService: MessageService,
    private request: RequesterService,
    private primengConfig: PrimeNGConfig,
    private event: EventEmitterService) {
    this.event.sendData({ title: "Météo" })
  }

  ngOnInit(): void {
    this.responsiveOptions = [
      { breakpoint: '1400px', numVisible: 3, numScroll: 3 },
      { breakpoint: '1220px', numVisible: 2, numScroll: 2 },
      { breakpoint: '1100px', numVisible: 1, numScroll: 1 }
    ];
    if (this.cities){
      console.log(this.cities);
      this.cityList=this.cities;
    }
    this.loadCities().then(() => {
      this.onCityChange({ page: 0 })
    });
  }
  /**
   * Load Cities list from localstorage or init with default value
   * @returns array of object {city: "name of the city", data:"data fetch from the weather service" }
   */
  loadCities(): any {
    return new Promise((resolve, reject) => {
      let store = localStorage.getItem(this.storeName);
      if (store) {
        this.cityList = JSON.parse(store);
      }
      for (let index = 0; index < this.cityList.length; index++) {
        const element = this.cityList[index];
        this.currentData[index] = { city: element, data: {} };
      }
      resolve(true)
    });
  }
  /**
   * Call Weather Api, with the city name
   * Add an url Map, for dispalyin the location, returned by the weatheservice
   * Update the current data with updated weather datas
   * @param idx : index onf the city in the city list
   */
  getWeather(idx: number) {
    let requestCity = this.cityList[idx]
    const url = "/weather/current?q=" + requestCity;
    this.request.getApi(url).subscribe((response: any) => {
      // console.log(response);
      if (response.body.status === 200) {
        let current = response.body.data;
        current.refreshAt = new Date();
        this.currentData[idx]['data'] = current;
        this.messageService.add({ severity: 'success', summary: 'Météo actualisée', detail: requestCity });
      } else {
        this.currentData[idx] = {}
        this.messageService.add({ severity: 'error', summary: response.body.msg, detail: response.body.api + ' : ' + response.body.data });
      }
      console.log(this.currentData);
    });
  }
  /**
   * Event on each change for the carrousel
   * Call Weather service if the delay is over
   * @param event the page number of the carrousel : {page:n}
   */
  onCityChange(event: any) {
    console.log(event);
    let idx = event.page;
    if (this.currentData[idx]['data'].refreshAt) {
      const n = new Date();
      var dif = Math.abs((n.getTime() - this.currentData[idx]['data'].refreshAt.getTime()) / 1000);
      if (dif > this.timerRefresh) {
        this.getWeather(idx);
      }
    } else {
      this.getWeather(idx);
    }
  }
  checkData(city: any) {
    return (Object.keys(city.data).length !== 0)
  }
}

