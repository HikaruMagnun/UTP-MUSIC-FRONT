import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MusicService } from '../../services/music.service';
import { Playlist } from '../../models/playlist.interface';
import { User } from '../../models/user.interface';
import { ApiSong } from '../../models/artist.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule],
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
    this.router.navigate(['/listener/' + route]);
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
