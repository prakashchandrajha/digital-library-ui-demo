import { Routes } from '@angular/router';
import { AuthPage } from './pages/auth-page/auth-page';
import { IntroPageComponent } from './pages/intro-page/intro-page';
import { AuthGuard } from './auth.guard';
import { CategoryDetailComponent } from './pages/category-detail-component/category-detail-component';
import { AdminDashboardComponent } from './admin/admin-dashboard-component/admin-dashboard-component';
import { AdminDashboardContent } from './admin/admin-dashboard-content/admin-dashboard-content';
import { UserCrudComponent } from './admin/user-crud-component/user-crud-component';
import { CategoryCrudComponent } from './admin/category-crud-component/category-crud-component';
import { PublicationCrudComponent } from './admin/publication-crud-component/publication-crud-component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthPage },
  {
    path: 'intro',
    component: IntroPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'category/:id/details',
    component: CategoryDetailComponent
  },
  {
    path: 'home',
    component: IntroPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardContent },
      { path: 'users', component: UserCrudComponent },
      { path: 'category', component: CategoryCrudComponent },
      { path: 'publication', component: PublicationCrudComponent }
    ]
  }
];
