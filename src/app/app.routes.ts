import { Routes } from '@angular/router';
import { AuthPage } from './pages/auth-page/auth-page';
import { IntroPageComponent } from './pages/intro-page/intro-page';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthPage },
  {
    path: 'intro',
    component: IntroPageComponent,
    canActivate: [AuthGuard]
  }
];
