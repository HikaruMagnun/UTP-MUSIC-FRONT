import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { ApiSong } from '../../models/artist.interface';

@Component({
  selector: 'app-artist-music',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
})
export class MusicComponent implements OnInit {
  songs: ApiSong[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadArtistSongs();
  }

  loadArtistSongs(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Get artist ID from localStorage
    try {
      const artistData = localStorage.getItem('LOGIN_ARTISTA');
      if (artistData) {
        const artist = JSON.parse(artistData);

        // Get songs by artist ID
        this.apiService.getSongsByArtist(artist.id).subscribe({
          next: (songs) => {
            this.songs = songs;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading songs:', error);
            this.errorMessage = 'No se pudieron cargar las canciones';
            this.isLoading = false;
          },
        });
      } else {
        this.errorMessage = 'No se encontró información del artista';
        this.isLoading = false;
      }
    } catch (error) {
      console.error('Error parsing artist data:', error);
      this.errorMessage = 'Error al procesar la información del artista';
      this.isLoading = false;
    }
  }

  formatDuration(seconds: number): string {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getFormattedDate(): string {
    // Just return today's date for demo purposes
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${today.getFullYear()}`;
  }
}
