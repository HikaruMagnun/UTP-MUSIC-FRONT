import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ApiSong } from '../../models/artist.interface';

@Component({
  selector: 'app-artist-music',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
})
export class MusicComponent implements OnInit {
  songs: ApiSong[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  // Para subir canción
  showUploadForm = false;
  songName = '';
  songFile: File | null = null;
  uploadProgress = 0;
  isUploading = false;
  artistId: number | null = null;

  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    this.loadArtistSongs();
    this.loadArtistData();
  }
  
  loadArtistData(): void {
    try {
      const artistData = localStorage.getItem('LOGIN_ARTISTA');
      if (artistData) {
        const artist = JSON.parse(artistData);
        this.artistId = artist.id;
      }
    } catch (error) {
      console.error('Error parsing artist data:', error);
    }
  }

  loadArtistSongs(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Get artist ID from localStorage
    try {
      const artistData = localStorage.getItem('LOGIN_ARTISTA');
      if (artistData) {
        const artist = JSON.parse(artistData);

        // Get songs by artist ID
        this.apiService.getSongsByArtist(artist.id).subscribe({
          next: (songs) => {
            this.songs = songs;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading songs:', error);
            this.errorMessage = 'No se pudieron cargar las canciones';
            this.isLoading = false;
          },
        });
      } else {
        this.errorMessage = 'No se encontró información del artista';
        this.isLoading = false;
      }
    } catch (error) {
      console.error('Error parsing artist data:', error);
      this.errorMessage = 'Error al procesar la información del artista';
      this.isLoading = false;
    }
  }

  formatDuration(seconds: number): string {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  getFormattedDate(): string {
    // Just return today's date for demo purposes
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${today.getFullYear()}`;
  }

  toggleUploadForm(): void {
    this.showUploadForm = !this.showUploadForm;
    this.resetForm();
  }

  resetForm(): void {
    this.songName = '';
    this.songFile = null;
    this.uploadProgress = 0;
    this.errorMessage = null;
    this.successMessage = null;
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.songFile = input.files[0];
      
      // Calcular la duración automáticamente si es posible
      if (this.songFile.type.includes('audio')) {
        const audio = new Audio();
        audio.src = URL.createObjectURL(this.songFile);
        
        audio.onloadedmetadata = () => {
          // La duración está en segundos
          console.log('Duración detectada:', Math.round(audio.duration));
        };
      }
    }
  }

  uploadSong(): void {
    if (!this.songName || !this.songFile || !this.artistId) {
      this.errorMessage = 'Por favor complete todos los campos y seleccione un archivo de audio';
      return;
    }

    this.isUploading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.uploadProgress = 10; // Iniciar con 10% para mostrar actividad

    // Obtener la duración del archivo de audio
    const getDuration = new Promise<number>((resolve) => {
      if (this.songFile!.type.includes('audio')) {
        const audio = new Audio();
        audio.src = URL.createObjectURL(this.songFile!);
        
        audio.onloadedmetadata = () => {
          resolve(Math.round(audio.duration));
        };
        
        // En caso de error o timeout, usar una estimación
        setTimeout(() => {
          if (!audio.duration) {
            const estimatedDuration = Math.round(this.songFile!.size / 15000);
            resolve(estimatedDuration);
          }
        }, 1000);
      } else {
        // Si no es un archivo de audio, usar una estimación basada en el tamaño
        const estimatedDuration = Math.round(this.songFile!.size / 15000);
        resolve(estimatedDuration);
      }
    });

    getDuration.then(duration => {
      this.uploadProgress = 30; // Avanzar progreso
      
      this.apiService.addSong(this.songName, duration, this.artistId!, this.songFile!)
        .subscribe({
          next: (response) => {
            console.log('Canción subida exitosamente:', response);
            this.uploadProgress = 100;
            this.successMessage = 'Canción subida exitosamente';
            this.isUploading = false;
            
            // Esperar un momento antes de cerrar el formulario y actualizar
            setTimeout(() => {
              this.loadArtistSongs(); // Recargar la lista de canciones
              this.resetForm();
              this.showUploadForm = false;
            }, 1500);
          },
          error: (error) => {
            console.error('Error al subir la canción:', error);
            this.errorMessage = 'Error al subir la canción. Por favor intente nuevamente.';
            this.isUploading = false;
            this.uploadProgress = 0;
          }
        });
    });
  }
}
