import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeriodDto } from './periods.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PeriodsService {
  private baseUrl = '/modules/periods';

  constructor(private http: HttpClient) {}

  getPeriods(): Observable<PeriodDto[]> {
    return this.http.get<PeriodDto[]>(`${this.baseUrl}`);
  }

  getPeriod(id: string): Observable<PeriodDto> {
    return this.http.get<PeriodDto>(`${this.baseUrl}/${id}`);
  }

  createPeriod(dto: PeriodDto): Observable<PeriodDto> {
    return this.http.post<PeriodDto>(`${this.baseUrl}`, dto);
  }

  updatePeriod(id: string, dto: PeriodDto): Observable<PeriodDto> {
    return this.http.put<PeriodDto>(`${this.baseUrl}/${id}`, dto);
  }

  deletePeriod(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
