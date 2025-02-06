import { Component, HostListener, ViewChild } from '@angular/core';
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
export class LayoutComponent {
  minimized: boolean = false;
  screenWidth = 0;

  constructor(public sessionService: SessionService) {}

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
