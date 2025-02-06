import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserSession } from 'src/app/shared/interfaces/userSession';

import conf from '../../../../proxy.conf.json';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { LayoutUtils } from 'src/app/shared/utils/layout.utils';
import { LabelValue } from 'src/app/shared/interfaces/labelValue';
import { TranslateService } from '@ngx-translate/core';
import { NewUser } from 'src/app/shared/interfaces/newUser';

@Injectable({ providedIn: 'root' })
export class SessionService {

  private role: string;
  private permissions: string[] = [];
  private preferences: Record<string, any> = {};
  private userEmail?: string;
  private userIsAdmin?: boolean;
  private userDataSubject = new BehaviorSubject<UserSession>(null);

  showMenuEmitter = new EventEmitter<boolean>();
  constructor(
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  getToken() {
    return localStorage.getItem('token');
  }

  getDismissed() {
    let value = localStorage.getItem('dismissed');
    return (value == 'true')
  }

  getUrl() {
    return conf['/api/*'].target;//isDevMode() ? conf['/api/*'].target : window.location.origin;
  }

  setUserData(data: any): void {
    this.userDataSubject.next(data);
  }

  getUserData(): any {
    return this.userDataSubject.value;
  }

  onUserDataChange(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  async updateSession() {
    this.http.get<UserSession>('/auth/user/session').subscribe((userData: UserSession) => {
      this.setUserDataSession(userData);
    });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  clearSession() {
    this.setUserData(null)
    localStorage.clear();
  }

  redirectToLogin() {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  redirectToHome() {
    this.router.navigate(['/dashboard']);
  }

  setDismissed() {
    localStorage.setItem('dismissed', 'true');
  }

  setUserDataSession(data: UserSession) {
    this.role = data.role;
    this.setUserData(data);
    // this.permissions = data.userPreferences.permissions.map;
    this.preferences = data.userPreferences.reduce((acc: Record<string, any>, item: LabelValue) => {
      acc[item.label] = item.value;
      return acc;
    }, {});

    this.triggerUserSessionUpdate();
  }

  login(toastService: ToastService, email: string, password: string) {
    let body = {
      'email': email,
      'password': password
    };

    this.http.post('/auth/login', body).subscribe({
      next: async (response: any) => {
        if (response.token) {
          this.validateLogin(response.token);
        } else {
          let sessionId = response.sessionId;
          localStorage.setItem('sessionId', sessionId);

          let validationType = response.validationType;
          switch (validationType) {
            case 'otp': {
              let createOtp = response.createOtp;
              localStorage.setItem('createOtp', createOtp);
              this.router.navigate(['/validate/otp']);
              break;
            }
            case 'email': {
              this.router.navigate(['/validate/email'], { queryParams: { resend: response.resend } });
              break;
            }
          };
        }
      },
      error: (err) => {
        let msg = 'Invalid username or password';
        console.log(err);
        if ((err as any)?.status !== 401) {
          msg = 'Error: ' + (err as any).error.message;
        }
        toastService.warning(msg);
      },
    });
  }

  generateUserOTP() {
    return this.http.post('/auth/otp/generate', {sessionId: localStorage.getItem('sessionId')})
  }

  async validateLogin(token) {
    localStorage.setItem('token', token);
    localStorage.removeItem('sessionId');
    await this.updateSession();
    this.redirectToHome();
  }

  validateOtp(otp: string, saveSession: boolean) {
    return this.http.post('/auth/otp/validate', {sessionId: localStorage.getItem('sessionId'), passCode: otp, saveSession})
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Get roles
  getRoles(): string {
    return this.role;
  }

  isAdmin(): boolean {
    return this.role.includes('admin');
  }

  // Check if user has a specific role
  hasRole(role: string): boolean {
    return this.role === role;
  }

  // Check if user has a specific permission
  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  // Get preferences
  getPreferences(): Record<string, any> {
    return { ...this.preferences };
  }

  // Get a specific preference
  getPreference(key: string): any {
    return this.preferences[key];
  }


  getUserLanguage() {
    let preferredLanguage = this.getPreference('preferredLanguage') ? this.getPreference('preferredLanguage') : sessionStorage.getItem('preferredLanguage');
    return preferredLanguage || 'en';
  }

  getDarkMode(): boolean {
    let colorSchema = this.getPreference('colorSchema') ? this.getPreference('colorSchema') : sessionStorage.getItem('colorSchema');
    return colorSchema === 'dark';
  }

  triggerUserSessionUpdate() {
    let isDarkMode = this.getDarkMode();
    LayoutUtils.switch_theme_rules(isDarkMode);
    
    this.translate.use(this.getUserLanguage());
  }

  setUserProperties(values: {key: string, value: any}[]) {
    return this.http.post('/modules/settings/layout', values).subscribe({
      next: async (response: any) => {
        this.updateSession();
      },
      error: (err) => {
        let msg = 'Error updating user properties';
        console.log(err);
      },
    });
  }


  signup(newUser: NewUser) {
    return this.http.post('/auth/user', newUser);
  }

  validateUser(passCode: string) {
    return this.http.post('/auth/user/validate', {sessionId: localStorage.getItem('sessionId'), passCode})
  }

  resendVerificationCode() {
    return this.http.post('/auth/verification-code/resend', {sessionId: localStorage.getItem('sessionId')})
  }

}
