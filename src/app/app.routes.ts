import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { authorizationGuard } from './authorization/guards/authorization.guard';
import { ShowcaseComponent } from './pages/showcase/showcase.component';
import { authorizationRoutes } from './authorization/authorization.routes';
import { DashboardComponent } from './modules/dashboard/dashboard/dashboard.component';


const routes: Routes = [
  ...authorizationRoutes,
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [authorizationGuard], data: { breadcrumb: 'Dashboard' } },
      {
        path: 'properties',
        loadChildren: () =>
          import('./modules/properties/properties.module').then(
            (m) => m.PropertiesModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./modules/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
      },
      {
        path: 'calculations',
        loadChildren: () =>
          import('./modules/calculation/calculation.module').then(
            (m) => m.CalculationModule
          ),
      },
      { path: 'showcase', component: ShowcaseComponent, canActivate: [authorizationGuard], data: { breadcrumb: 'Showcase' } },

    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
