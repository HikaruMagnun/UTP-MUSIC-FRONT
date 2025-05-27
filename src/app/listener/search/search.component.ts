import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Song, RecentSearch } from '../../models/song.model';
import { Artist, ApiSong } from '../../models/artist.interface';
import { ApiService } from '../../services/api.service';
import { MusicService } from '../../services/music.service';
import { Playlist } from '../../models/playlist.interface';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  recentSearches: RecentSearch[] = [];
  artists: Artist[] = [];
  apiSongs: ApiSong[] = [];
  filteredSongs: Song[] = [];
  playlists: Playlist[] = [];
  currentUser: User | null = null;
  showPlaylistDropdown: { [key: number]: boolean } = {};
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  showErrorMessage: boolean = false;
  errorMessage: string = '';
  showPlaylistModal: boolean = false;
  selectedSong: ApiSong | null = null;
  artistNames: { [key: number]: string } = {};
  constructor(
    private apiService: ApiService,
    private musicService: MusicService
  ) {
    const userStr = localStorage.getItem('LOGIN_USER');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
  }

  ngOnInit(): void {
    this.filteredSongs = [];
    if (this.currentUser) {
      this.loadPlaylists();
    }
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredSongs = [];
      this.artists = [];
      this.apiSongs = [];
      return;
    }

    this.searchArtists();
    this.searchSongs();
  }

  private searchArtists(): void {
    this.apiService
      .getArtistBySearchQuery(this.searchQuery)
      .subscribe((artists: Artist[]) => {
        this.artists = artists;
      });
  }
  private searchSongs(): void {
    console.log('Searching songs with query:', this.searchQuery);
    this.apiService
      .getSongsBySearchQuery(this.searchQuery)
      .subscribe((songs: ApiSong[]) => {
        console.log('Songs received from API:', songs);
        this.apiSongs = songs;
        this.convertApiSongsToDisplaySongs();
      });
  }
  private convertApiSongsToDisplaySongs(): void {
    this.filteredSongs = this.apiSongs.map((song) => ({
      id: song.id.toString(),
      title: song.titulo,
      artist: song.artistaId.toString(), // You might want to fetch artist details separately
      duration: this.formatDuration(song.duracion),
      imageUrl: '', // Placeholder for solid gray background
      color: this.generateRandomColor(),
    }));

    // Cargar nombres de artistas después de convertir las canciones
    this.loadArtistNames();
  }

  private generateRandomColor(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60); // Ensure 'Math' is the global object
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  onSongClick(song: ApiSong): void {
    console.log('Song clicked:', song);
    console.log('Archive URL:', song.archivoUrl);
    const streamUrl = this.apiService.getSongStreamUrl(song.archivoUrl);
    console.log('Stream URL:', streamUrl);
    this.musicService.playSong(song, streamUrl);
  }

  onMouseEnter(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target) {
      target.style.backgroundColor = 'rgba(255,255,255,0.1)';
    }
  }
  onMouseLeave(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target) {
      target.style.backgroundColor = 'transparent';
    }
  }

  loadPlaylists(): void {
    if (!this.currentUser) return;

    this.apiService.getPlaylistsByUser(this.currentUser.id).subscribe({
      next: (playlists: Playlist[]) => {
        this.playlists = playlists;
      },
      error: (error: any) => {
        console.error('Error loading playlists:', error);
      },
    });
  }

  togglePlaylistDropdown(songIndex: number, event: Event): void {
    event.stopPropagation();
    this.showPlaylistDropdown[songIndex] =
      !this.showPlaylistDropdown[songIndex];

    // Close other dropdowns
    Object.keys(this.showPlaylistDropdown).forEach((key) => {
      if (parseInt(key) !== songIndex) {
        this.showPlaylistDropdown[parseInt(key)] = false;
      }
    });
  }  addToPlaylist(song: ApiSong, playlist: Playlist, event: Event): void {
    event.stopPropagation();

    this.apiService.addSongToPlaylist(playlist.id, song.id).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.showSuccessMessage = true;
          this.successMessage = `"${song.titulo}" agregada a "${playlist.nombre}"`;
          // Close dropdown
          this.showPlaylistDropdown = {};
          // Hide success message after 3 seconds
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        } else {
          this.handleDropdownError('Respuesta inesperada del servidor');
        }
      },
      error: (error: any) => {
        console.error('Error adding song to playlist:', error);
        this.handleDropdownError('Error al agregar la canción a la playlist');
      },
    });
  }

  private handleDropdownError(message: string): void {
    this.showErrorMessage = true;
    this.errorMessage = message;
    this.showPlaylistDropdown = {};
    // Hide error message after 3 seconds
    setTimeout(() => {
      this.showErrorMessage = false;
    }, 3000);
  }
  onAddToPlaylistClick(songIndex: number, event: Event): void {
    this.togglePlaylistDropdown(songIndex, event);
  }

  onSongRightClick(event: MouseEvent, song: ApiSong): void {
    event.preventDefault(); // Prevenir el menú contextual del navegador
    this.selectedSong = song;
    this.showPlaylistModal = true;
  }

  closePlaylistModal(): void {
    this.showPlaylistModal = false;
    this.selectedSong = null;
  }  addSongToPlaylistFromModal(playlist: Playlist): void {
    if (!this.selectedSong) return;

    this.apiService
      .addSongToPlaylist(playlist.id, this.selectedSong.id)
      .subscribe({
        next: (result: any) => {
          if (result.success) {
            this.showSuccessMessage = true;
            this.successMessage = `"${this.selectedSong!.titulo}" agregada a "${
              playlist.nombre
            }"`;
            this.closePlaylistModal();
            // Hide success message after 3 seconds
            setTimeout(() => {
              this.showSuccessMessage = false;
            }, 3000);
          } else {
            this.handlePlaylistError('Respuesta inesperada del servidor');
          }
        },
        error: (error: any) => {
          console.error('Error adding song to playlist:', error);
          this.handlePlaylistError('Error al agregar la canción a la playlist');
        },
      });
  }

  private handlePlaylistError(message: string): void {
    this.showErrorMessage = true;
    this.errorMessage = message;
    this.closePlaylistModal();
    // Hide error message after 3 seconds
    setTimeout(() => {
      this.showErrorMessage = false;
    }, 3000);
  }

  getArtistName(artistaId: number): string {
    return this.artistNames[artistaId] || `Artista ID: ${artistaId}`;
  }

  private loadArtistNames(): void {
    // Cargar nombres de artistas para los que tenemos canciones
    const uniqueArtistIds = [
      ...new Set(this.apiSongs.map((song) => song.artistaId)),
    ];

    uniqueArtistIds.forEach((artistId) => {
      if (!this.artistNames[artistId]) {
        // Encontrar el artista en la lista de artistas cargados
        const artist = this.artists.find((a) => a.id === artistId);
        if (artist) {
          this.artistNames[artistId] = artist.nombreArtistico;
        }
      }
    });
  }
}
