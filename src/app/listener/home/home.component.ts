import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MusicService } from '../../services/music.service';
import { Playlist } from '../../models/playlist.interface';
import { User } from '../../models/user.interface';
import { ApiSong } from '../../models/artist.interface';
import { PlaylistViewComponent } from '../playlist-view/playlist-view.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule, PlaylistViewComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  playlists: Playlist[] = [];
  currentUser: User | null = null;
  currentSong: ApiSong | null = null;
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1;
  selectedPlaylist: Playlist | null = null;

  constructor(
    public router: Router,
    private apiService: ApiService,
    public musicService: MusicService
  ) {
    const userStr = localStorage.getItem('LOGIN_USER');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
  }
  ngOnInit() {
    if (this.currentUser) {
      this.loadPlaylists();
    } else {
      console.error('No user found in localStorage');
      this.router.navigate(['/login/listener']);
    }

    // Subscribe to music service observables
    this.musicService.currentSong$.subscribe((song) => {
      this.currentSong = song;
    });

    this.musicService.isPlaying$.subscribe((playing) => {
      this.isPlaying = playing;
    });

    this.musicService.currentTime$.subscribe((time) => {
      this.currentTime = time;
    });

    this.musicService.duration$.subscribe((duration) => {
      this.duration = duration;
    });

    this.musicService.volume$.subscribe((volume) => {
      this.volume = volume;
    });
  }

  loadPlaylists() {
    if (!this.currentUser) return;

    this.apiService.getPlaylistsByUser(this.currentUser.id).subscribe({
      next: (playlists) => {
        this.playlists = playlists;
      },
      error: (error) => {
        console.error('Error loading playlists:', error);
      },
    });
  }
  navigateTo(route: string) {
    if (route === 'new-playlist') {
      this.createNewPlaylist();
    } else {
      this.selectedPlaylist = null; // Clear playlist selection when navigating
      this.router.navigate(['/listener/' + route]);
    }
  }

  createNewPlaylist() {
    if (!this.currentUser) return;

    // Generate playlist name based on existing count
    const playlistCount = this.playlists.length;
    const playlistName = `Nueva playlist ${playlistCount + 1}`;

    const playlistData = {
      nombre: playlistName,
      usuarioId: this.currentUser.id,
      visibilidad: 'PUBLICA',
    };

    console.log('Creating playlist:', playlistData);

    this.apiService.createPlaylist(playlistData).subscribe({
      next: (response) => {
        console.log('Playlist created successfully:', response);
        // Reload playlists to get the updated list
        this.loadPlaylists();
        // Auto-select the newly created playlist after a brief delay
        setTimeout(() => {
          const newPlaylist = this.playlists.find(
            (p) => p.nombre === playlistName
          );
          if (newPlaylist) {
            this.selectPlaylist(newPlaylist);
          }
        }, 100);
      },
      error: (error) => {
        console.error('Error creating playlist:', error);
      },
    });
  }

  selectPlaylist(playlist: Playlist) {
    this.selectedPlaylist = playlist;
    console.log('Selected playlist:', playlist);
    // Navigate to show playlist content (we'll implement this view later)
    // For now, just log the selection
  }

  // Music player control methods
  togglePlayPause(): void {
    this.musicService.togglePlayPause();
  }

  onProgressClick(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * this.duration;
    this.musicService.setCurrentTime(newTime);
  }

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const volume = parseFloat(input.value);
    this.musicService.setVolume(volume);
  }

  formatTime(seconds: number): string {
    return this.musicService.formatTime(seconds);
  }

  getProgressPercentage(): number {
    if (this.duration === 0) return 0;
    return (this.currentTime / this.duration) * 100;
  }
}
