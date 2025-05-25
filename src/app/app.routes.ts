import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './artist/dashboard/dashboard.component';
import { HomeComponent } from './listener/home/home.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login/:userType', component: LoginComponent },
  { path: 'register/:userType', component: RegisterComponent },
  { path: 'artist/dashboard', component: DashboardComponent },
  { path: 'listener/home', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
