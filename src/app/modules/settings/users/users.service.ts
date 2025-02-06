import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableData } from 'src/app/shared/interfaces/tableData';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    private apiUrl = '/modules/settings/users/';

    constructor(private http: HttpClient) { }

    getUsers(): Observable<TableData> {
        return this.http.get<TableData>(this.apiUrl);
    }
}