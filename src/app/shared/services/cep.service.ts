import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private readonly apiUrl = '/cep';
  constructor(private http: HttpClient) {}

  getDadosCep(cep: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${cep}/json`);
  }
}
