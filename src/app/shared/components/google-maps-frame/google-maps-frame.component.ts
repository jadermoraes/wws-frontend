/// <reference types="google.maps" />

import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-google-maps-frame',
  templateUrl: './google-maps-frame.component.html',
  styleUrls: ['./google-maps-frame.component.scss']
})
export class GoogleMapsFrameComponent implements OnChanges, AfterViewInit {
  @Input() address: string = ''; // Address to display
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  map!: google.maps.Map;
  marker!: google.maps.marker.AdvancedMarkerElement | null;
  geocoder!: google.maps.Geocoder;

  ngAfterViewInit(): void {
    if (typeof google !== 'undefined' && google.maps) {
      this.initMap();
    } else {
      console.error('Google Maps API is not loaded. Ensure it is included in index.html');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address'] && this.address && this.map) {
      this.geocodeAddress();
    }
  }

  initMap(): void {
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: 40.7128, lng: -74.0060 }, // Default: New York
      zoom: 14,
      mapId: 'DEMO_MAP_ID' // Optional: Set a Map ID if using Cloud Styling
    });

    this.geocoder = new google.maps.Geocoder();

    // Check if AdvancedMarkerElement is available
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      this.marker = new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        position: { lat: 40.7128, lng: -74.0060 },
        title: 'Selected Location'
      });
    } else {
      console.error('AdvancedMarkerElement is not available. Ensure the Google Maps script includes "&libraries=marker".');
      this.marker = null;
    }

    if (this.address) {
      this.geocodeAddress();
    }
  }

  geocodeAddress(): void {
    this.geocoder.geocode({ address: this.address }, (results, status) => {
      if (status === 'OK' && results[0].geometry.location) {
        const location = results[0].geometry.location;
        this.map.setCenter(location);

        if (this.marker) {
          this.marker.position = location;
        }
      } else {
        console.error('Geocode was not successful: ' + status);
      }
    });
  }
}
