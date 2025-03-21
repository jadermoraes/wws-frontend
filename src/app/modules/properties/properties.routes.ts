import { Routes } from '@angular/router';
import { authorizationGuard } from 'src/app/authorization/guards/authorization.guard';
import { isAdminGuard } from 'src/app/authorization/guards/is-admin.guard';
import { PropertyComponent } from './property/property.component';
import { PropertiesComponent } from './properties/properties.component';

export const propertiesRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' }, 
  {
    path: 'list',
    component: PropertiesComponent,
    canActivate: [authorizationGuard],
    data: { breadcrumb: 'property' }
  },
  {
    path: 'property/:id',
    component: PropertyComponent,
    canActivate: [authorizationGuard],
    data: { breadcrumb: 'Property' }
  },
];
