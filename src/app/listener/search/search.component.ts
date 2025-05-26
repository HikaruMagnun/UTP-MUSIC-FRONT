import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Song, RecentSearch } from '../../models/song.model';
import { Artist, ApiSong } from '../../models/artist.interface';
import { ApiService } from '../../services/api.service';

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

  constructor(private apiService: ApiService) {}

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
    this.apiService
      .getSongsBySearchQuery(this.searchQuery)
      .subscribe((songs: ApiSong[]) => {
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
}
