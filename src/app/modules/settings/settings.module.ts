import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { settingsRoutes } from './settings.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { UsersComponent } from './users/users.component';
import { InvitationsComponent } from './invitations/invitations.component';
import { PeriodsComponent } from './periods/periods.component';


const COMPONENTS_AND_DIRECTIVES = [
    LayoutComponent,
    UsersComponent,
    InvitationsComponent,
    PeriodsComponent,
];

@NgModule({
    imports: [
      ReactiveFormsModule,
      SharedModule,
      CommonModule,
      RouterModule,
      FormsModule,
      TranslateModule,
      RouterModule.forChild(settingsRoutes)
    ],
    exports: [COMPONENTS_AND_DIRECTIVES],
    declarations: [COMPONENTS_AND_DIRECTIVES],
    providers: [],
})
export class SettingsModule {}
