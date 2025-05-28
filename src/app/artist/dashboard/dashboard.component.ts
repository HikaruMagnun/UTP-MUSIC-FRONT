import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { MusicComponent } from '../music/music.component';
import { AudienceComponent } from '../audience/audience.component';

interface Artist {
  id: number;
  nombreArtistico: string;
  biografia: string;
  imagenUrl: string;
}

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
  artist: Artist | null = null;
  artistInitials: string = 'A'; // Default initials if no artist name is found

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadArtistData();
  }

  loadArtistData(): void {
    try {
      const artistData = localStorage.getItem('LOGIN_ARTISTA');
      if (artistData) {
        this.artist = JSON.parse(artistData);

        // Generate initials from artist name if no image URL is provided
        if (this.artist && this.artist.nombreArtistico) {
          const nameParts = this.artist.nombreArtistico.split(' ');
          if (nameParts.length > 0) {
            this.artistInitials = nameParts
              .map((part) => part[0])
              .join('')
              .toUpperCase()
              .substring(0, 2);
          }
        }
      } else {
        console.warn('No artist data found in localStorage');
      }
    } catch (error) {
      console.error('Error loading artist data:', error);
    }
  }

  changeTab(tab: 'home' | 'music' | 'audience'): void {
    this.activeTab = tab;
  }

  logout(): void {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('LOGIN_ARTISTA');

    // Navigate to home
    this.router.navigate(['/']);
  }
}
