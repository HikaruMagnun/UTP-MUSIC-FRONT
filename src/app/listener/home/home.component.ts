import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate(['/listener/' + route]);
  }
}
