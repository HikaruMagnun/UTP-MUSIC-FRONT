import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Playlist } from '../../models/playlist.interface';
import { User } from '../../models/user.interface';

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

  constructor(public router: Router, private apiService: ApiService) {
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
}
