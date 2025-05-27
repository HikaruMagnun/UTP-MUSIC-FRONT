import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiSong } from '../models/artist.interface';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private audio = new Audio();
  private currentSongSubject = new BehaviorSubject<ApiSong | null>(null);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private currentTimeSubject = new BehaviorSubject<number>(0);
  private durationSubject = new BehaviorSubject<number>(0);
  private volumeSubject = new BehaviorSubject<number>(1);

  public currentSong$ = this.currentSongSubject.asObservable();
  public isPlaying$ = this.isPlayingSubject.asObservable();
  public currentTime$ = this.currentTimeSubject.asObservable();
  public duration$ = this.durationSubject.asObservable();
  public volume$ = this.volumeSubject.asObservable();

  constructor() {
    this.setupAudioEventListeners();
  }

  private setupAudioEventListeners(): void {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audio.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.durationSubject.next(this.audio.duration);
    });

    this.audio.addEventListener('ended', () => {
      this.isPlayingSubject.next(false);
    });

    this.audio.addEventListener('play', () => {
      this.isPlayingSubject.next(true);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlayingSubject.next(false);
    });
  }
  playSong(song: ApiSong, streamUrl: string): void {
    console.log('PlaySong called with:', { song, streamUrl });
    this.audio.src = streamUrl;
    this.currentSongSubject.next(song);
    this.audio.load();
    this.audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  }

  togglePlayPause(): void {
    if (this.audio.paused) {
      this.audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    } else {
      this.audio.pause();
    }
  }

  setCurrentTime(time: number): void {
    this.audio.currentTime = time;
  }

  setVolume(volume: number): void {
    this.audio.volume = volume;
    this.volumeSubject.next(volume);
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration || 0;
  }

  getCurrentSong(): ApiSong | null {
    return this.currentSongSubject.value;
  }

  isPlaying(): boolean {
    return this.isPlayingSubject.value;
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
