import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';

  // Signal to track authentication state
  isAuthenticated = signal<boolean>(this.hasValidToken());

  /**
   * Authenticates the user by generating and storing a random 3-digit number
   */
  login(): void {
    const token = this.generateRandomToken();
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    this.isAuthenticated.set(true);
  }

  /**
   * Logs out the user by removing the token from localStorage
   */
  logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    this.isAuthenticated.set(false);
  }

  /**
   * Gets the current authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  /**
   * Checks if a valid token exists in localStorage
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    return token !== null && this.isValidToken(token);
  }

  /**
   * Validates that the token is a 3-digit number
   */
  private isValidToken(token: string): boolean {
    return /^\d{3}$/.test(token);
  }

  /**
   * Generates a random 3-digit number (100-999)
   */
  private generateRandomToken(): string {
    const randomNumber = Math.floor(Math.random() * 900) + 100;
    return randomNumber.toString();
  }
}

