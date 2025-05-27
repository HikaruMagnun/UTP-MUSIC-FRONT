import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Playlist } from '../../models/playlist.interface';
import { ApiService } from '../../services/api.service';
import { MusicService } from '../../services/music.service';
import { ApiSong } from '../../models/artist.interface';

@Component({
  selector: 'app-playlist-view',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './playlist-view.component.html',
  styleUrls: ['./playlist-view.component.scss'],
})
export class PlaylistViewComponent implements OnInit, OnChanges {
  @Input() playlist: Playlist | null = null;
  songs: ApiSong[] = [];
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private musicService: MusicService
  ) {}

  ngOnInit(): void {
    if (this.playlist) {
      this.loadPlaylistSongs();
    }
  }

  ngOnChanges(): void {
    if (this.playlist) {
      this.loadPlaylistSongs();
    }
  }
  loadPlaylistSongs(): void {
    if (!this.playlist) return;

    this.isLoading = true;
    this.apiService.getPlaylistSongs(this.playlist.id).subscribe({
      next: (songs: ApiSong[]) => {
        this.songs = songs;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading playlist songs:', error);
        this.songs = [];
        this.isLoading = false;
      },
    });
  }

  onSongClick(song: ApiSong): void {
    const streamUrl = this.apiService.getSongStreamUrl(song.archivoUrl);
    this.musicService.playSong(song, streamUrl);
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  removeSongFromPlaylist(song: ApiSong): void {
    if (!this.playlist) return;

    this.apiService
      .removeSongFromPlaylist(this.playlist.id, song.id)
      .subscribe({
        next: () => {
          console.log('Song removed from playlist successfully');
          this.loadPlaylistSongs(); // Reload playlist songs
        },
        error: (error: any) => {
          console.error('Error removing song from playlist:', error);
        },
      });
  }
}
