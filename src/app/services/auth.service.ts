import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService, private router: Router) {
    // Check if user is logged in on service initialization
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  loginArtista(username: string, password: string): Observable<any> {
    return this.apiService.loginArtist(username, password).pipe(
      tap((response) => {
        localStorage.setItem('LOGIN_ARTISTA', JSON.stringify(response));
        this.router.navigate(['/artist/dashboard']);
      })
    );
  }

  register(userData: any, userType: string): Observable<any> {
    if (userType === 'artist') {
      return this.apiService.registerArtist(userData);
    } else {
      return this.apiService.registerListener(userData);
    }
  }

  registerListener(userData: any): Observable<any> {
    return this.apiService.registerListener(userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    this.currentUserSubject.next(null);
    this.router.navigate(['']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserType(): string | null {
    return localStorage.getItem('userType');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  loginListener(username: string, password: string): Observable<any> {
    return this.apiService.loginListener(username, password).pipe(
      tap((response) => {
        localStorage.setItem('LOGIN_USER', JSON.stringify(response));
        this.router.navigate(['/listener/home']);
      })
    );
  }
}
