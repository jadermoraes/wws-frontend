import { Component, ElementRef, ViewChild, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';

declare let google: any; // Ensures TypeScript doesn't complain

@Component({
  selector: 'app-google-map-modal',
  templateUrl:'google-map-modal.component.html',
  styleUrls: ['google-map-modal.component.scss']
})


export class GoogleMapModalComponent implements AfterViewInit {
  @ViewChild('streetViewContainer', { static: true }) streetViewContainer!: ElementRef;
  @Input() address!: string;
  @Output() onClose = new EventEmitter<void>();
  @Output() onImageSelected = new EventEmitter<string>();

  private panorama: any;
  private heading: number = 0;
  private pitch: number = 0;

  async ngAfterViewInit() {
    await this.loadGoogleMapsAPI();
    this.getCoordinates(this.address)
      .then(coords => this.initStreetView(coords))
      .catch(error => console.error('Error getting coordinates:', error));
  }

  async loadGoogleMapsAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window['google'] && window['google'].maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }

  async getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!google || !google.maps || !google.maps.Geocoder) {
        reject('Google Maps API not loaded');
        return;
      }

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].geometry.location);
        } else {
          reject('Geocoding failed: ' + status);
        }
      });
    });
  }

  initStreetView(coords: { lat: number, lng: number }) {
    if (!google || !google.maps || !google.maps.StreetViewPanorama) {
      console.error('Google Maps API not loaded properly');
      return;
    }

    this.panorama = new google.maps.StreetViewPanorama(
      this.streetViewContainer.nativeElement,
      {
        position: coords,
        pov: { heading: this.heading, pitch: this.pitch },
        zoom: 1
      }
    );

    // Add a listener after panorama has been fully initialized
    google.maps.event.addListener(this.panorama, 'pov_changed', () => {
      const pov = this.panorama.getPov();
      this.heading = pov.heading;
      this.pitch = pov.pitch;
    });

    console.log('StreetView initialized.');
  }

  captureStreetViewImage() {
    if (!this.panorama) {
      console.error('Panorama is not initialized yet.');
      return;
    }

    // Use the current panorama, heading, and pitch
    const panoId = this.panorama.pano;
    const streetViewService = new google.maps.StreetViewService();

    // Get the panorama from the current Street View
    streetViewService.getPanoramaById(panoId, (data: any, status: any) => {
      if (status === google.maps.StreetViewStatus.OK) {
        const imgUrl = `https://maps.googleapis.com/maps/api/streetview?size=800x400&pano=${panoId}&heading=${this.heading}&pitch=${this.pitch}&key=AIzaSyBWLG1bPoy2e2G2ot7U1_gTB853VbB6mmU`;
        this.onImageSelected.emit(imgUrl);
      } else {
        console.error('Street View Image capture failed.');
      }
    });
  }

  fetchStreetViewImage(coords: { lat: number, lng: number }) {
    if (!this.panorama) {
      console.error('Panorama is not initialized yet.');
      return;
    }

    // Use the current panorama, heading, and pitch
    const panoId = this.panorama.pano;
    const streetViewService = new google.maps.StreetViewService();

    // Get the panorama from the current Street View
    streetViewService.getPanoramaById(panoId, (data: any, status: any) => {
      if (status === google.maps.StreetViewStatus.OK) {
        const imgUrl = `https://maps.googleapis.com/maps/api/streetview?size=800x400&pano=${panoId}&heading=${this.heading}&pitch=${this.pitch}&key=AIzaSyBWLG1bPoy2e2G2ot7U1_gTB853VbB6mmU`;
        this.onImageSelected.emit(imgUrl);
      } else {
        console.error('Street view not available for the given location.');
      }
    });
  }

  closeModal() {
    this.onClose.emit();
  }
}
