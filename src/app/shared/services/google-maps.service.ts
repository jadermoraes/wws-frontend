import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) {}

  getCoordinates(address: string): Observable<any> {
    const params = {
      address,
      key: 'AIzaSyBWLG1bPoy2e2G2ot7U1_gTB853VbB6mmU'
    };

    return this.http.get<any>(this.geocodeUrl, { params });
  }
}
