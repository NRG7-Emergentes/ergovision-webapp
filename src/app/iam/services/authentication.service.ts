import { Injectable, signal } from '@angular/core';
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

  baseUrl: string = `${environment.apiUrl}`;
  httpOptions = { headers: new HttpHeaders({'Content-type': 'application/json'})};

  // Signals to track authentication state
  isSignedIn = signal<boolean>(this.hasValidToken());
  userId = signal<number | null>(null);
  username = signal<string | null>(null);
  userImageUrl = signal<string | null>(null);
  userRoles = signal<string[]>([]);

  constructor(private router: Router, private http: HttpClient) {}

  /**
   * Try to auto sign in from stored token
   */
  tryAutoSignIn(): void {
    const token = this.getToken();
    if (!token) return;
    this.isSignedIn.set(true);
    // Optionally decode token and set user info
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
        this.userRoles.set(response.roles);
        this.userImageUrl.set(response.imageUrl);

        // Store in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_id', String(response.id));
        localStorage.setItem('username', response.username);

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
   * Checks if a valid token exists in localStorage
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    return token !== null && token.length > 0;
  }

}

