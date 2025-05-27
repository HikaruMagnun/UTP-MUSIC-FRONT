import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Playlist } from '../models/playlist.interface';
import { ApiSong } from '../models/artist.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    });
  }

  // Authentication endpoints
  loginArtist(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(
      `${this.baseUrl}/artistas/login`,
      { email: email, password: password },
      { headers }
    );
  }

  loginListener(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(
      `${this.baseUrl}/usuarios/login`,
      { username: username, password: password },
      { headers }
    );
  }

  registerArtist(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/artistas/register`, userData);
  }

  registerListener(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.baseUrl}/usuarios/register`, userData, {
      headers,
    });
  }

  // Artist endpoints
  getArtistProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/artists/profile`, {
      headers: this.getHeaders(),
    });
  }

  // Listener endpoints
  getListenerProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/listeners/profile`, {
      headers: this.getHeaders(),
    });
  }

  // Music endpoints
  getSongs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/songs`, {
      headers: this.getHeaders(),
    });
  }

  uploadSong(songData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      ...(localStorage.getItem('token') && {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
    return this.http.post(`${this.baseUrl}/songs/upload`, songData, {
      headers,
    });
  }
  // Playlist endpoints
  getPlaylistsByUser(userId: number): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(
      `${this.baseUrl}/playlists/list-by-user/${userId}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  // Create new playlist
  createPlaylist(playlistData: {
    nombre: string;
    usuarioId: number;
    visibilidad: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/playlists/create`, playlistData, {
      headers: this.getHeaders(),
    });
  }

  // listar canciones de búsqueda por título
  getSongsBySearchQuery(titulo: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/canciones/search`, {
      headers: this.getHeaders(),
      params: { titulo },
    });
  }
  // listar canciones de búsqueda por título
  getArtistBySearchQuery(nombreArtistico: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/artistas/search`, {
      headers: this.getHeaders(),
      params: { nombreArtistico },
    });
  }
  // Generate streaming URL for a song
  getSongStreamUrl(archivoUrl: string): string {
    return `${this.baseUrl}/canciones/stream/${archivoUrl}`;
  }

  // Add song to user's listening history
  addToHistory(idUsuario: number, idCancion: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/historial/add`, null, {
      headers: this.getHeaders(),
      params: {
        idUsuario: idUsuario.toString(),
        idCancion: idCancion.toString(),
      },
    });
  }
  // Get songs from a specific playlist
  getPlaylistSongs(playlistId: number): Observable<ApiSong[]> {
    return this.http.get<ApiSong[]>(
      `${this.baseUrl}/playlists/list-canciones/${playlistId}`,
      {
        headers: this.getHeaders(),
      }
    );
  }// Add song to playlist
  addSongToPlaylist(playlistId: number, songId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/playlists/add-cancion?playlistId=${playlistId}&cancionId=${songId}`,
      null,
      {
        headers: this.getHeaders(),
        observe: 'response'
      }
    ).pipe(
      map(response => {
        // Considerar éxito cualquier código 2xx
        if (response.status >= 200 && response.status < 300) {
          return { success: true, status: response.status, data: response.body };
        }
        throw new Error(`Unexpected status: ${response.status}`);
      }),
      catchError(error => {
        console.error('API Error:', error);
        // Si es un error HTTP pero el status es 2xx, considerarlo éxito
        if (error.status >= 200 && error.status < 300) {
          return of({ success: true, status: error.status });
        }
        throw error;
      })
    );
  }

  // Remove song from playlist
  removeSongFromPlaylist(playlistId: number, songId: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/playlists/${playlistId}/songs/${songId}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}
