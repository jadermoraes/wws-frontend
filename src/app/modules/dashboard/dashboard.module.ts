import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './dashboard/dashboard.component';


const COMPONENTS_AND_DIRECTIVES = [
  DashboardComponent
];

@NgModule({
    imports: [
      ReactiveFormsModule,
      SharedModule,
      CommonModule,
      RouterModule,
      FormsModule,
      TranslateModule,
      RouterModule.forChild(dashboardRoutes)
    ],
    exports: [COMPONENTS_AND_DIRECTIVES],
    declarations: [COMPONENTS_AND_DIRECTIVES],
    providers: [],
})
export class DashboardModule {}
