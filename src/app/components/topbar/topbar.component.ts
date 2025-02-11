import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/authorization/services/session.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit, OnDestroy {

  constructor(public sessionService: SessionService, private translate: TranslateService) {}
  private userDataSubscription!: Subscription;
  showProfileMenu: boolean = false;
  isUserLoggedIn: boolean = true;
  profilePicture: string = '';
  name: string = '';

  onMouseEnter() {
    this.showProfileMenu = true;
  }

  onMouseLeave() {
    this.showProfileMenu = false;
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe({
      next: async (lang: any) => {
    }});

    this.userDataSubscription = this.sessionService
      .onUserDataChange()
      .subscribe((userData) => {
        this.name = userData?.firstName || '';
        this.profilePicture =
          userData?.profilePicture || './assets/avatar-placeholder.svg';
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }
}
