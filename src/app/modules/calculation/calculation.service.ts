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
    private apiStepsUrl = '/modules/steps';

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

    getWozValues(calculation: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${calculation}/woz`);
    }

    validateBagId(calculation: string, addressId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${calculation}/bag`, {addressId});
    }
    
    getElData(calculation: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${calculation}/el`);
    }

    getSteps(calculation: string): Observable<any> {
        return this.http.get<any>(`${this.apiStepsUrl}/${calculation}`);
    }

    getStepData(calculation: string, stepId: string): Observable<any> {
        return this.http.get<any>(`${this.apiStepsUrl}/${calculation}/step/${stepId}`);
    }

    saveStepStep(calculation: string, stepId: string, data: any): Observable<any> {
        return this.http.post<any>(`${this.apiStepsUrl}/${calculation}/step/${stepId}`, data);
    }

    getSpaceGroups(): Observable<any> {
        return this.http.get<any>(`${this.apiStepsUrl}/spaces/types`);
    }

    getKitchenFacilities(): Observable<any> {
        return this.http.get<any>(`${this.apiStepsUrl}/kitchens/facilities`);
    }

    getToiletFacilities(): Observable<any> {
        return this.http.get<any>(`${this.apiStepsUrl}/toilets/facilities`);
    }

    startCalculation(calculation: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${calculation}/start`, {});
    }

    getCalculationOverview(calculation: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${calculation}/overview`);
    }

    getCalculationLogs(calculation: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${calculation}/logs`);
    }
}