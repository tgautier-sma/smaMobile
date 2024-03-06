import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
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
import { OverlayModule } from 'primeng/overlay';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { OrderListModule } from 'primeng/orderlist';
import { CarouselModule } from 'primeng/carousel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Router } from '@angular/router';

/** Mapbox params */
let map_param = {
  token: "pk.eyJ1IjoidGdhdXRpZXIiLCJhIjoiY2t5eXBxZmthMDFoMjJ1azQ2bzdqNjg5aiJ9.JlxVT_17ky6yKSohtKseig",
  url: "https://api.mapbox.com/styles/v1/mapbox",
  /* style: "streets-v11", */
  style: "navigation-day-v1",
  mode: "static",
  zoom: 12,
}

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule, AccordionModule, ToastModule, FileUploadModule, OverlayModule, ToolbarModule,
    CardModule, DropdownModule, InputNumberModule, OrderListModule, CarouselModule,
    OverlayPanelModule, SplitButtonModule,
    InputGroupModule, InputTextModule, NgxJsonViewerModule, FormsModule
  ],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [MessageService]
})
export class WeatherComponent implements OnInit {
  map_param = {
    token: "pk.eyJ1IjoidGdhdXRpZXIiLCJhIjoiY2t5eXBxZmthMDFoMjJ1azQ2bzdqNjg5aiJ9.JlxVT_17ky6yKSohtKseig",
    url: "https://api.mapbox.com/styles/v1/mapbox",
    /* style: "streets-v11", */
    style: "navigation-day-v1",
    mode: "static",
    zoom: 11,
    map_styles: [
      { name: "Rues", id: "streets-v11" },
      { name: "Relief", id: "outdoors-v11" },
      { name: "Claire", id: "light-v10" },
      { name: "Sombre", id: "dark-v10" },
      { name: "Satellite", id: "satellite-v9" },
      { name: "Satellite & rues", id: "satellite-streets-v11" },
      { name: "Navigation en journée", id: "navigation-day-v1" },
      { name: "Navigation de nuit", id: "navigation-night-v1" },
    ]
  }
  timerRefresh = 600; // second
  page = 0;
  storeName = "weather_List"
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
  items: MenuItem[] | undefined;


  constructor(
    private messageService: MessageService,
    private request: RequesterService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private event: EventEmitterService) {
    this.event.sendData({ title: "Météo" })
  }

  ngOnInit(): void {
    this.loadCities().then(() => {
      this.onCityChange({ page: 0 })
    });
    this.items = [
      {
        label: 'Accueil',
        icon: 'pi pi-home',
        routerLink: ['/dashboard']
      }
    ];
  }
  goHome() {
    this.router.navigate(['/dashboard']);
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
        this.currentData[index] = { city: element, data: {}, checkData: false };
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
        current.mapUrl = `${this.map_param.url}/${this.map_param.style}/${this.map_param.mode}/${current.coord.lon},${current.coord.lat},${this.map_param.zoom},0.00,0.00/600x400@2x?access_token=${this.map_param.token}`;
        current.refreshAt = new Date();
        this.currentData[idx]['data'] = current;
        this.currentData[idx]['checkData'] = true;
        this.messageService.add({ severity: 'success', summary: 'Météo actualisée', detail: requestCity });
      } else {
        this.currentData[idx] = { city: requestCity, data: {}, checkData: false }
        this.messageService.add({ severity: 'error', summary: response.body.msg, detail: response.body.api + ' : ' + response.body.data });
      }
      // console.log(this.currentData);
    });
  }
  /**
   * Event on each change for the carrousel
   * Call Weather service if the delay is over
   * @param event the page number of the carrousel : {page:n}
   */
  onCityChange(event: any) {
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
  updateMaps() {
    this.currentData.forEach(current => {
      if (current.data.coord) {
        current.data.mapUrl = `${this.map_param.url}/${this.map_param.style}/${this.map_param.mode}/${current.data.coord.lon},${current.data.coord.lat},${this.map_param.zoom},0.00,0.00/600x400@2x?access_token=${this.map_param.token}`;
      } else {
        // this.messageService.add({ severity: 'error', summary: 'Cartes actualisées', detail: `La carte de ${current.city} non mise à jour.` });
        current.data.mapUrl = "";
      }
    });
    this.messageService.add({ severity: 'success', summary: 'Cartes actualisées', detail: "Toutes les cartes sont mises à jour." });
  }
  search(event: any) {
    console.log(event);
    /* const url = "/tools/get?q=https://api-adresse.data.gouv.fr/search/?type=municipality&autocomplete=1&q=" + event.query;
    this.request.getApi(url).subscribe((response: any) => {
      console.log(response);
      // this.results = data;
    }); */
  }
  /**
   * Cities list management
   */
  addCity() {
    if (this.cityAdd.length > 1) {
      this.cityList.push(this.cityAdd);
      const idx = this.cityList.length;
      localStorage.setItem(this.storeName, JSON.stringify(this.cityList));
      //this.getWeather(this.cityAdd);
      this.cityAdd = "";
      this.loadCities().then((response: any) => {
        this.onCityChange({ page: idx - 1 })
      });
    }
  }
  cityListSelected(event: any) {
    console.log(event);
    //this.citySelected = event.value
  }
  cityListReorded(event: any) {
    console.log(event);
    console.log(this.cityList);
    localStorage.setItem(this.storeName, JSON.stringify(this.cityList));
    this.loadCities();
  }
  delCities() {
    this.citySelected.forEach(element => {
      var index = this.cityList.indexOf(element);
      if (index > -1) {
        this.cityList.splice(index, 1); // Remove array element
      }
    })
    localStorage.setItem(this.storeName, JSON.stringify(this.cityList));
    this.loadCities();
    this.messageService.add({ severity: 'success', summary: 'Vos villes', detail: "lignes supprimées" });
  };
}

