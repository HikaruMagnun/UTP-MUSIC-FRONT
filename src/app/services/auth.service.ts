import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

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

  login(email: string, password: string, userType: string): Observable<any> {
    return new Observable((observer) => {
      this.apiService.login(email, password, userType).subscribe({
        next: (response) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('userType', userType);
            this.currentUserSubject.next(response.user);

            // Redirect based on user type
            if (userType === 'artist') {
              this.router.navigate(['/artist/dashboard']);
            } else {
              this.router.navigate(['/listener/home']);
            }
          }
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  register(userData: any, userType: string): Observable<any> {
    if (userType === 'artist') {
      return this.apiService.registerArtist(userData);
    } else {
      return this.apiService.registerListener(userData);
    }
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
}
