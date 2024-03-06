import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-map',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnChanges {
  private map!: L.Map
  markers = new L.FeatureGroup();
  /* 
    L.marker([31.9539, 35.9106]), // Amman
    L.marker([32.5568, 35.8469]) // Irbid
  ]; */
  @Input() lng: any = 48.866667;
  @Input() lat: any = 2.333333;
  @Input() points!: any[];
  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.initializeMap();
    // console.log("Map is ready");
    this.addMarkers();
    this.centerMap();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    for (let propName in changes) {
      if (propName === "points") {
        let chng = changes[propName];
        let cur = chng.currentValue;
        cur.forEach((element: any) => {
          // console.log(element);
          const geo:L.LatLngExpression=element.pos;
          const label=element.label+"<br>"+geo.toString();
          var marker: L.Marker = new L.Marker(geo);
          marker.bindPopup(label);
          this.markers.addLayer(marker);
        });
        this.centerMap();
      }
    }
  }

  private initializeMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    this.map = L.map('map');
    L.tileLayer(baseMapURl).addTo(this.map);
    this.map.setView([this.lat, this.lng], 8);
  }

  private addMarkers() {
    // Add your markers to the map
    // console.log("Markers", this.markers, this.markers.length, this.map);
    this.map.removeLayer(this.markers);
    this.map.addLayer(this.markers);

    // this.centerMap();
  }

  private centerMap() {
    // Create a LatLngBounds object to encompass all the marker locations
    if (this.map){
      const bounds = this.markers.getBounds();
      // Fit the map view to the bounds
      this.map.fitBounds(bounds);
    }
  }
}
