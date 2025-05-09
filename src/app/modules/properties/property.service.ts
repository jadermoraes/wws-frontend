import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableData } from 'src/app/shared/interfaces/tableData';
import { Property } from 'src/app/shared/interfaces/property';

@Injectable({
    providedIn: 'root'
})
export class PropertyService {

    private apiUrl = '/modules/properties';

    private apiPostcodeUrl = 'https://free.bedrijfsdata.nl/v1.1/bag?';


    constructor(private http: HttpClient) { }

    getProperties(): Observable<TableData> {
        return this.http.get<TableData>(this.apiUrl);
    }

    getProperty(id: string): Observable<Property> {
        return this.http.get<Property>(`${this.apiUrl}/${id}`);
    }

    createProperty(property: Property): Observable<Property> {
        return this.http.post<Property>(this.apiUrl, property);
    }

    getAddress(postalCode: string, number: number): Observable<any> {
        return this.http.get<any>(`${this.apiPostcodeUrl}postcode=${postalCode}&number=${number}`);
    }
}