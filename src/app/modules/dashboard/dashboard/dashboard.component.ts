import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/authorization/services/session.service';
import { PropertyService } from '../../properties/property.service';

@Component({
  selector: 'wws-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private sessionService: SessionService, 
    private translate: TranslateService, 
    private cdr: ChangeDetectorRef,
    private router: Router,
    private propertyService: PropertyService,
  ) { }

  username: string = '';
  private userDataSubscription!: Subscription;
  listedProperties = '';
  properties = ''
  listedPropertiesCount = 0;

  ngOnInit() {
    this.userDataSubscription = this.sessionService
      .onUserDataChange()
      .subscribe((userData) => {
        this.username = `${userData?.firstName} ${userData?.lastName}`;
      });

      this.translate.onLangChange.subscribe({
        next: async (lang: any) => {
      }});  

      this.propertyService.getProperties().subscribe((data) => {
        data.rows.length > 0 ? this.listedPropertiesCount = data.rows.length : this.listedPropertiesCount = 0;
        this.listedProperties = this.translate.instant('dashboard.listedProperties', {value: this.listedPropertiesCount});
        this.properties = this.translate.instant('dashboard.properties');
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  isAdmin(): boolean {
    return this.sessionService?.isAdmin();
  }

  navigateToPropertyList() {
    this.router.navigate(['/properties/list']);
  }
}
