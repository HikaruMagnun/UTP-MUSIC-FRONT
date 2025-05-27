import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playlist } from '../models/playlist.interface';

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
}
