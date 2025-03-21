import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../shared/shared.module";
import { SpacesComponent } from "./steps/spaces/spaces.component";
import { CalculationComponent } from "./calculation.component";
import { RouterModule } from "@angular/router";
import { calculationRoutes } from "./calculation.routes";
import { StepsHeaderComponent } from "./components/steps-header/steps-header.component";
import { StepsComponent } from "./components/steps/steps.component";
import { CalculationNewComponent } from "./calculation-new/calculation-new.component";
import { StepsFooterComponent } from "./components/steps-footer/steps-footer.component";
import { CalculationOverviewComponent } from "./overview/calculation-overview.component";
import { GeneralComponent } from "./steps/general/general.component";

const COMPONENTS_AND_DIRECTIVES = [
    CalculationComponent,
    CalculationNewComponent,
    StepsFooterComponent,
    StepsHeaderComponent,
    SpacesComponent,
    GeneralComponent,
    StepsComponent,
    CalculationOverviewComponent
];

@NgModule({
    imports: [
      ReactiveFormsModule,
      SharedModule,
      CommonModule,
      RouterModule,
      FormsModule,
      TranslateModule,
      RouterModule.forChild(calculationRoutes)
    ],
    exports: [COMPONENTS_AND_DIRECTIVES],
    declarations: [COMPONENTS_AND_DIRECTIVES],
    providers: [],
})
export class CalculationModule {}
