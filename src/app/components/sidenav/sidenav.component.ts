import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { NavbarData } from './nav-data';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { SessionService } from 'src/app/authorization/services/session.service';
import { Subscription } from 'rxjs';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut
  ]
})
export class SidenavComponent implements OnInit, OnDestroy {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  private userDataSubscription!: Subscription;
  collapsed = false;
  screenWidth = 0;
  navData: INavbarData[] = [];
  navDataCopy: INavbarData[];
  multiple: boolean = false;
  isAdmin: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768 ) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.sidenav') && this.collapsed) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: 0});
    }
  }

  constructor(public router: Router, private translate: TranslateService, private sessionService:SessionService) {
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

    this.translate.onLangChange.subscribe({
      next: async (lang: any) => {
        this.navDataCopy = new NavbarData(this.translate, this.sessionService).getNavbarData();
        this.navData = this.getFilteredNavbarData();
        this.reSubscribeToSessionService();
    }});
  }

  reSubscribeToSessionService(): void {
    if (this.userDataSubscription)
      this.userDataSubscription.unsubscribe();
    this.userDataSubscription = this.sessionService
      .onUserDataChange()
      .subscribe((userData) => {
        this.isAdmin = userData?.role.includes('admin');
        if (this.navDataCopy)
          this.navData = this.getFilteredNavbarData();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);

    if (!this.collapsed) {
      this.collapsed = true;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: 0});

      item.expanded = true;
    } else {
      item.expanded = !item.expanded
    }
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for(let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }

  getFilteredNavbarData(): INavbarData[] {
    let navbarData = this.navDataCopy;

    let filterAdminGuard = (items: INavbarData[]): INavbarData[] => {
        return items
            .filter(item => (!item.adminGuard || this.isAdmin)) // Remove items with `adminGuard = true`
            .map(item => ({
                ...item,
                // Recursively filter child items if they exist
                items: item.items ? filterAdminGuard(item.items) : undefined
            }));
    };

    return filterAdminGuard(navbarData);
  }

}
