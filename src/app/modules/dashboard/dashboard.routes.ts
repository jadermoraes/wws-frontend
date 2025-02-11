import { Routes } from '@angular/router';
import { authorizationGuard } from 'src/app/authorization/guards/authorization.guard';
import { isAdminGuard } from 'src/app/authorization/guards/is-admin.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authorizationGuard],
    data: { breadcrumb: 'dashboard' }
  },
];
