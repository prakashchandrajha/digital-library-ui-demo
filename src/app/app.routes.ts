import { Routes } from '@angular/router';
import { AuthPage } from './pages/auth-page/auth-page';
import { IntroPageComponent } from './pages/intro-page/intro-page';
import { AuthGuard } from './auth.guard';
import { CategoryDetailComponent } from './pages/category-detail-component/category-detail-component';
import { AdminDashboardComponent } from './admin/admin-dashboard-component/admin-dashboard-component';
import { AdminDashboardContent } from './admin/admin-dashboard-content/admin-dashboard-content';
import { CategoryCrudComponent } from './admin/category-crud-component/category-crud-component';
import { PublicationCrudComponent } from './admin/publication-crud-component/publication-crud-component';
import { AboutComponent } from './pages/about-component/about-component';
import { ContactComponent } from './pages/contact-component/contact-component';

export const routes: Routes = [
  // Intro page shown first
  { path: '', redirectTo: '/intro', pathMatch: 'full' },

  // Public routes
  { path: 'intro', component: IntroPageComponent },
  { path: 'auth', component: AuthPage },
  { path: 'category/:id/details', component: CategoryDetailComponent },
  { path: 'home', component: IntroPageComponent },  // If you have a separate home page, change this
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  // Protected admin routes
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardContent },
      { path: 'category', component: CategoryCrudComponent },
      { path: 'publication', component: PublicationCrudComponent }
    ]
  }
];
