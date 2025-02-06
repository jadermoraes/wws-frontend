import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/homepage/homepage.component';
import { LayoutComponent } from './components/layout/layout.component';
import { authorizationGuard } from './authorization/guards/authorization.guard';
import { ShowcaseComponent } from './pages/showcase/showcase.component';
import { authorizationRoutes } from './authorization/authorization.routes';


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
      { path: 'dashboard', component: HomePageComponent, canActivate: [authorizationGuard], data: { breadcrumb: 'Início' } },
      {
        path: 'settings',
        loadChildren: () =>
          import('./modules/settings/settings.module').then(
            (m) => m.SettingsModule
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
