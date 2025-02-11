import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PropertyComponent } from './property/property.component';
import { propertiesRoutes } from './properties.routes';
import { PropertiesComponent } from './properties/properties.component';


const COMPONENTS_AND_DIRECTIVES = [
    PropertyComponent,
    PropertiesComponent
];

@NgModule({
    imports: [
      ReactiveFormsModule,
      SharedModule,
      CommonModule,
      RouterModule,
      FormsModule,
      TranslateModule,
      RouterModule.forChild(propertiesRoutes)
    ],
    exports: [COMPONENTS_AND_DIRECTIVES],
    declarations: [COMPONENTS_AND_DIRECTIVES],
    providers: [],
})
export class PropertiesModule {}
