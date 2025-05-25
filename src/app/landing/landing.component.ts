import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const listenerVideo = document.querySelector(
        '.listener-section .background-video'
      ) as HTMLVideoElement,
      artistVideo = document.querySelector(
        '.artist-section .background-video'
      ) as HTMLVideoElement;

    if (listenerVideo) {
      listenerVideo.pause();

      const listenerSection = document.querySelector('.listener-section');

      listenerSection?.addEventListener('mouseenter', () => {
        listenerVideo.play();
      });

      listenerSection?.addEventListener('mouseleave', () => {
        listenerVideo.pause();
      });
    }

    if (artistVideo) {
      artistVideo.pause();

      const artistSection = document.querySelector('.artist-section');

      artistSection?.addEventListener('mouseenter', () => {
        artistVideo.play();
      });

      artistSection?.addEventListener('mouseleave', () => {
        artistVideo.pause();
      });
    }
  }

  selectUserType(userType: 'artist' | 'listener'): void {
    this.router.navigate(['/register', userType]);
  }

  goToLogin(): void {
    // For now, redirect to artist login. We can add a modal to choose later
    this.router.navigate(['/login', 'artist']);
  }
}
