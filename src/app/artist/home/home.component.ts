import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-artist-home',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  // Mock data
  recentStats = {
    oyentes: 19,
    reproducciones: 26,
    seguidores: 19,
    periodo: 'ULTIMOS 7 DIAS',
  };

  overallStats = {
    oyentes: 1900,
    reproducciones: 2600,
    seguidores: 300,
    periodo: 'DESDE SIEMPRE',
    escuchandoAhora: 10,
  };
}
