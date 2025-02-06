import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private sessionService: SessionService, 
    private router: Router, 
    private translate: TranslateService,
    private location: Location,
  ) {}

  logout(): void {
    this.sessionService.clearSession(); 
    window.location.href = window.location.origin + '/login';
  }

  goback(): void {
    this.location.back();
  }
}
