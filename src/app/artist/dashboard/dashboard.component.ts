import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { MusicComponent } from '../music/music.component';
import { AudienceComponent } from '../audience/audience.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    HomeComponent,
    MusicComponent,
    AudienceComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  activeTab: 'home' | 'music' | 'audience' = 'home';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialization code
  }

  changeTab(tab: 'home' | 'music' | 'audience'): void {
    this.activeTab = tab;
  }

  logout(): void {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Navigate to home
    this.router.navigate(['/']);
  }
}
