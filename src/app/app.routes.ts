import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './artist/dashboard/dashboard.component';
import { HomeComponent } from './listener/home/home.component';
import { SearchComponent } from './listener/search/search.component';
import { NewPlaylistComponent } from './listener/new-playlist/new-playlist.component';
import { HomeContentComponent } from './listener/home-content/home-content.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login/:userType', component: LoginComponent },
  { path: 'register/:userType', component: RegisterComponent },
  { path: 'artist/dashboard', component: DashboardComponent },
  {
    path: 'listener',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeContentComponent },
      { path: 'search', component: SearchComponent },
      { path: 'new-playlist', component: NewPlaylistComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
