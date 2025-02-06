import { Routes } from '@angular/router';
import { authorizationGuard } from 'src/app/authorization/guards/authorization.guard';
import { LayoutComponent } from './layout/layout.component';
import { UsersComponent } from './users/users.component';
import { isAdminGuard } from 'src/app/authorization/guards/is-admin.guard';
import { InvitationsComponent } from './invitations/invitations.component';

export const settingsRoutes: Routes = [
  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [authorizationGuard],
    data: { breadcrumb: 'Layout' }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authorizationGuard, isAdminGuard],
    data: { breadcrumb: 'Users' }
  },
  {
    path: 'invitations',
    component: InvitationsComponent,
    canActivate: [authorizationGuard],
    data: { breadcrumb: 'Invitations' }
  },
];
