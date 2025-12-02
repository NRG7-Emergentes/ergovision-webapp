import {inject, Injectable, signal} from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignUpRequest } from '@app/iam/domain/model/sign-up.request';
import { SignUpResponse } from '@app/iam/domain/model/sign-up.response';
import { SignInRequest } from '@app/iam/domain/model/sign-in.request';
import { SignInResponse } from '@app/iam/domain/model/sign-in.response';
import { Observable, tap } from 'rxjs';
import {toast} from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  baseUrl: string = `${environment.apiUrl}`;
  httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

  // Signals to track authentication state (readonly to prevent reassignment)
  readonly isSignedIn = signal<boolean>(this.hasValidToken());
  readonly userId = signal<number | null>(null);
  readonly username = signal<string | null>(null);
  readonly userImageUrl = signal<string | null>(null);
  readonly userRoles = signal<string[]>([]);

  /**
   * Try to auto sign in from stored token
   */
  tryAutoSignIn(): void {
    const token = this.getToken();
    if (!token) return;

    // Restore user data from localStorage
    const userId = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('user_role');
    const userImageUrl = localStorage.getItem('user_image_url');

    this.isSignedIn.set(true);

    if (userId) {
      this.userId.set(Number(userId));
    }

    if (username) {
      this.username.set(username);
    }

    if (userRole) {
      this.userRoles.set([userRole]);
    }

    if (userImageUrl) {
      this.userImageUrl.set(userImageUrl);
    }
  }

  /**
   * Get current user ID synchronously
   */
  getCurrentUserIdSync(): number | null {
    return this.userId();
  }

  /**
   * Get user ID from token
   */
  getUserIdFromToken(): number | null {
    try {
      const token = this.getToken()?.replace(/^"|"$/g, '');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id || payload.userId || payload.sub;
        return userId ? Number(userId) : null;
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
    return null;
  }

  /**
   * Get current user role
   */
  currentUserRole(): string {
    return localStorage.getItem('user_role') || '';
  }

  getUserImageUrl(): string | null {
    return this.userImageUrl();
  }

  /**
   * Sign up a new user
   * @param signUpRequest The sign up request
   * @return The sign up response
   */
  signUp(signUpRequest: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(
      `${this.baseUrl}/authentication/sign-up`,
      signUpRequest,
      this.httpOptions
    );
  }

  /**
   * Sign in an existing user
   * @param signInRequest The sign in request
   * @param redirectToDashboard Whether to redirect to dashboard after sign in
   * @return The sign in response
   */
  signIn(signInRequest: SignInRequest, redirectToDashboard = true): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(
      `${this.baseUrl}/authentication/sign-in`,
      signInRequest,
      this.httpOptions
    ).pipe(
      tap(response => {
        console.log('Sign-in successful:', response);

        // Update signals
        this.isSignedIn.set(true);
        this.userId.set(response.id);
        this.username.set(response.username);
        this.userRoles.set(response.roles || []);
        this.userImageUrl.set(response.imageUrl || null);

        // Store in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_id', String(response.id));
        localStorage.setItem('username', response.username);

        if (response.imageUrl) {
          localStorage.setItem('user_image_url', response.imageUrl);
        }

        if (response.roles && response.roles.length > 0) {
          localStorage.setItem('user_role', response.roles[0]);
        }

        // Redirect to dashboard
        if (redirectToDashboard) {
          this.router.navigate(['/dashboard']).then();
        }
      })
    );
  }

  /**
   * Sign out the current user
   */
  signOut(): void {
    // Clear signals
    this.isSignedIn.set(false);
    this.userId.set(null);
    this.username.set(null);
    this.userRoles.set([]);
    this.userImageUrl.set(null);

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_image_url');

    // Redirect to sign-in
    this.router.navigate(['/sign-in']).then();
  }

  /**
   * Gets the current authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Update user profile data (called after profile update)
   */
  updateUserProfile(imageUrl: string, username?: string): void {
    if (imageUrl) {
      this.userImageUrl.set(imageUrl);
      localStorage.setItem('user_image_url', imageUrl);
    }
    if (username) {
      this.username.set(username);
      localStorage.setItem('username', username);
    }
  }

  /**
   * Checks if a valid token exists in localStorage
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    return token !== null && token.length > 0;
  }

}

