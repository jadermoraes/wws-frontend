import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableData } from 'src/app/shared/interfaces/tableData';
import { Property } from 'src/app/shared/interfaces/property';
import { WozValues } from 'src/app/shared/interfaces/wozValues';

@Injectable({
    providedIn: 'root'
})
export class CalculationService {

    private apiUrl = '/modules/calculations';
    private apiPeriodsUrl = '/modules/periods';

    constructor(private http: HttpClient) { }

    getCalculations(propertyId): Observable<TableData> {
        return this.http.get<TableData>(`${this.apiUrl}/${propertyId}`);
    }

    getPeriods(): Observable<any[]> {
        return this.http.get<any[]>(this.apiPeriodsUrl);
    }

    createCalculation(propertyId: string, periodId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${propertyId}/new`, { 'period_id': periodId });
    }

    getWozValues(calculation: string): Observable<WozValues[]> {
        return this.http.get<any>(`${this.apiUrl}/${calculation}/woz`);
    }
}