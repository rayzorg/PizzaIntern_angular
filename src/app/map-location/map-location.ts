import { Component } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-location',
  imports: [],
  templateUrl: './map-location.html',
  styleUrl: './map-location.css',
})
export class MapLocation implements AfterViewInit {
  private map: any;

  private initMap(): void {
    this.map = L.map('map', {
      center: [50.902066, 4.056018],
      zoom: 13,
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);
    L.marker([50.902066, 4.056018]).addTo(this.map).bindPopup('Wijngaard 36, Aalst').openPopup();
  }

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }
}
