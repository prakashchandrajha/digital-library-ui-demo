import { Routes } from '@angular/router';
import { AuthPage } from './pages/auth-page/auth-page';
import { IntroPageComponent } from './pages/intro-page/intro-page';
import { AuthGuard } from './auth.guard';
import { CategoryDetailComponent } from './pages/category-detail-component/category-detail-component';
import { AdminDashboardComponent } from './admin/admin-dashboard-component/admin-dashboard-component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthPage },
  {
    path: 'intro',
    component: IntroPageComponent,
    canActivate: [AuthGuard]
  },
  // app-routing.module.ts
{
  path: 'category/:id/details',
  component: CategoryDetailComponent
}
,

// add by me 

  {
    path: 'home',
    component: IntroPageComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard]
  },
];
