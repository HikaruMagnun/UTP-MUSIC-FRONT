import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Song, RecentSearch } from '../../models/song.model';
import { Artist, ApiSong } from '../../models/artist.interface';
import { ApiService } from '../../services/api.service';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  recentSearches: RecentSearch[] = [];
  artists: Artist[] = [];
  apiSongs: ApiSong[] = [];
  filteredSongs: Song[] = [];

  constructor(
    private apiService: ApiService,
    private musicService: MusicService
  ) {}

  ngOnInit(): void {
    this.filteredSongs = [];
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
}
