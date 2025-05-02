import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, isDevMode } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class PasswordService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  verifyToken(token: string, email: string) {
    return this.http.post(`/auth/password/reset/validate`,{token, email});
  }

  resetPassword(token: string, email: string, password: string) {
    return this.http.post(`/auth/password/reset`, { token, email, password });
  }

  requestPasswordReset(email: string) {
    return this.http.get(`/auth/password/reset/${email}`);
  }

}
