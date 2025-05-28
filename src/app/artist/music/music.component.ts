import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-artist-music',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
})
export class MusicComponent {
  // Mock song data
  mockSongs = [
    {
      title: 'Good Old Days',
      duration: '3:50',
      date: '23/04/2025',
      plays: 2000,
    },
    {
      title: 'Good Old Days',
      duration: '3:50',
      date: '23/04/2025',
      plays: 2000,
    },
    {
      title: 'Good Old Days',
      duration: '3:50',
      date: '23/04/2025',
      plays: 2000,
    },
    {
      title: 'Good Old Days',
      duration: '3:50',
      date: '23/04/2025',
      plays: 2000,
    },
    {
      title: 'Good Old Days',
      duration: '3:50',
      date: '23/04/2025',
      plays: 2000,
    },
  ];
}
