import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-artist-audience',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss'],
})
export class AudienceComponent {
  growthPercentage = 31;
  topSong = 'CANCION 1';
  topCountry = 'PERU';
}
