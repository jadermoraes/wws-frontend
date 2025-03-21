import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { AuthorizationModule } from './authorization/authorization.module';
import { SharedModule } from './shared/shared.module';
import { HttpRequestsInterceptor } from './authorization/http-requests-interceptor';
import { LayoutComponent } from './components/layout/layout.component';
import { FooterComponent } from './components/footer/footer.component';
import { ShowcaseComponent } from './pages/showcase/showcase.component';
import { SettingsModule } from './modules/settings/settings.module';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { HttpClient } from '@angular/common/http';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { CalculationModule } from './modules/calculation/calculation.module';

import Bugsnag from '@bugsnag/js'
import BugsnagPerformance from '@bugsnag/browser-performance'
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular'

// configure Bugsnag ASAP
Bugsnag.start({ apiKey: 'ff9398f29a292c922c0fe44e010060f2' })
BugsnagPerformance.start({ apiKey: 'ff9398f29a292c922c0fe44e010060f2' })

// create a factory which will return the Bugsnag error handler
export function errorHandlerFactory() {
  return new BugsnagErrorHandler()
}


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    FooterComponent,
    ShowcaseComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthorizationModule,
    SharedModule,
    SettingsModule,
    DashboardModule,
    PropertiesModule,
    CalculationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestsInterceptor,
      multi: true,
    },
    { provide: ErrorHandler, useFactory: errorHandlerFactory },
    HttpClient
    //{ provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
