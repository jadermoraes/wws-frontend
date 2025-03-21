import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SessionService } from 'src/app/authorization/services/session.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  minimized: boolean = false;
  screenWidth = 0;
  hideSideNav: boolean = false;

  constructor(public sessionService: SessionService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.hideSideNav = this.ActivatedRoute.firstChild?.snapshot?.url[0]?.path === 'calculations';
  }

  ngOnInit(): void {
    this.updateSideNavVisibility();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideSideNav = this.ActivatedRoute.firstChild?.snapshot.url[0]?.path === 'calculations';
      });
  }

  private updateSideNavVisibility(): void {
    this.hideSideNav = this.ActivatedRoute.firstChild?.snapshot.url[0]?.path === 'calculations';
  }

  isLoggedIn() {
    return this.sessionService.isLoggedIn();
  }

  toggleSidebar() {
    this.minimized = !this.minimized;
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.minimized = data.collapsed;
  }
}
