import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableData } from 'src/app/shared/interfaces/tableData';
import { apiReturn } from 'src/app/shared/interfaces/apiReturn';

@Injectable({
    providedIn: 'root'
})
export class InvitationsService {

    private apiUrl = '/modules/settings/invitations/';
    private host = window.location.host;

    constructor(private http: HttpClient) { }

    sendInvitation(data: any): Observable<apiReturn> {
        return this.http.post<apiReturn>(this.apiUrl, data);
    }

    getInvitations(): Observable<TableData> {
        return this.http.get<TableData>(this.apiUrl);
    }

    acceptInvitation(id: string): Observable<apiReturn> {
        return this.http.post<apiReturn>(this.apiUrl + 'accept/' + id, {});
    }
}