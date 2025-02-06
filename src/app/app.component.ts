import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from './authorization/services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    this.applyTheme();
  }

  constructor(private translate: TranslateService,
    private sessionService: SessionService,
  ) {
    this.translate.setDefaultLang(this.sessionService.getUserLanguage());
  }

  applyTheme(): void {
    const darkModePreference = localStorage.getItem('darkMode');
    const isDarkModeEnabled = darkModePreference === 'true';
    this.switchThemeRules(isDarkModeEnabled);
  }

  switchThemeRules(isDarkMode: boolean): void {
    const body = document.body;
    if (isDarkMode) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    }
  }
}
