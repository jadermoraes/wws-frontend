import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from 'src/app/authorization/services/session.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { LayoutUtils } from 'src/app/shared/utils/layout.utils';

@Component({
  selector: 'wws-settings-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  isDarkModeEnabled = false;

  constructor(
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private userSession: SessionService,
    private translate: TranslateService
  ) {
    this.isDarkModeEnabled  = userSession.getDarkMode();
  }

  ngOnInit(): void {
    this.selectedLanguage = this.translate.currentLang;
  }

  async toggle() {
    let values = [{key: 'colorSchema', value: this.userSession.getDarkMode() ? 'light' : 'dark'}];
    console.log(values);
    await this.userSession.setUserProperties(values);
    this.toastService.success('Theme updated!');
  }
  
  selectedLanguage: string;
  languages = [
    { value: 'en', label: 'English' },
    { value: 'nl', label: 'Dutch' },
    // Add more languages as needed
  ];

  async changeLanguage(language: string) {
    let values = [{key: 'preferredLanguage', value: language}];
    console.log(values);
    await this.userSession.setUserProperties(values);
    this.toastService.success('Language updated!');
  }

  
}
