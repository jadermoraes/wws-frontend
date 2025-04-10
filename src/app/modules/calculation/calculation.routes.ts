import { Routes } from "@angular/router";
import { CalculationComponent } from "./calculation.component";
import { authorizationGuard } from "src/app/authorization/guards/authorization.guard";
import { SpacesComponent } from "./steps/spaces/spaces.component";
import { StepsComponent } from "./components/steps/steps.component";
import { CalculationNewComponent } from "./calculation-new/calculation-new.component";
import { CalculationOverviewComponent } from "./overview/calculation-overview.component";
import { GeneralComponent } from "./steps/general/general.component";
import { KitchensComponent } from "./steps/kitchens/kitchens.component";
import { ToiletsComponent } from "./steps/toilets/toilets.component";
import { AdditionalComponent } from "./steps/additional/additional.component";
import { SummaryComponent } from "./steps/summary/summary.component";

export const calculationRoutes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: ':propertyId/new', component: CalculationNewComponent, canActivate: [authorizationGuard], data: { mode: 'New' } },
    { path: ':id/overview', component: CalculationOverviewComponent, canActivate: [authorizationGuard], data: { mode: 'overview' } },
    { path: ':id/steps', canActivate: [authorizationGuard], component: StepsComponent,
      children: [
            { path: 'general', component: GeneralComponent, canActivate: [authorizationGuard], data: { breadcrumb: 'General' } },
            { path: 'spaces', component: SpacesComponent, canActivate: [authorizationGuard], data: { breadcrumb: 'Spaces' } },
            { path: 'kitchen', component: KitchensComponent, canActivate: [authorizationGuard], data: { breadcrumb: 'Kithen' } },
            { path: 'plumbing', component: ToiletsComponent, canActivate: [authorizationGuard], data: { breadcrumb: 'Plumbing' } },
            { path: 'additional', component: AdditionalComponent, canActivate: [authorizationGuard], data: { breadcrumb: 'Additional' } },
            { path: 'summary', component: SummaryComponent, canActivate: [authorizationGuard], data: { breadcrumb: 'Summary' } },            
          ]
     },
    { path: 'calculation', component: CalculationComponent, canActivate: [authorizationGuard], data: { breadcrumb: 'Finish' } },
    { path: '**', redirectTo: '/dashboard' }
  ];
