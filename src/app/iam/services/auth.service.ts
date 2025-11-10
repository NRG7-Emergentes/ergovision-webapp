import { Injectable, signal } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {SignInRequest} from "../domain/model/sign-in.request";
import {SignInResponse} from "../domain/model/sign-in.response";
import {SignUpRequest} from "../domain/model/sign-up.request";
import {SignUpResponse} from "../domain/model/sign-up.response";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  basePath: string = `${environment.apiUrl}`;
  httpOptions = { headers: new HttpHeaders({'Content-type': 'application/json'}) };

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private signedInUsername: BehaviorSubject<string> = new BehaviorSubject<string>('');

  //User Role
  private signedInUserRole: BehaviorSubject<string> = new BehaviorSubject<string>(
    localStorage.getItem('userRole') || ''
  );

  constructor(private router: Router, private http: HttpClient) { }

  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  get currentUserId() {
    return this.signedInUserId.asObservable();
  }

  get getCurrentUserId(): number  {
    return this.signedInUserId.value;
  }
  get getCurrentUserRole(): string {
    return this.signedInUserRole.value;
  }

  get currentUsername() {
    return this.signedInUsername.asObservable();
  }

  get currentUserRole() {
    return this.signedInUserRole.asObservable();
  }

  /**
   * Sign up a new user.
   * @param signUpRequest The sign up request.
   * @returns The sign up response.
   */
  signUp(signUpRequest: SignUpRequest) {
    return this.http.post<SignUpResponse>(`${this.basePath}/authentication/sign-up`, signUpRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          console.log(`Signed up as ${response.username} with id: ${response.id}`);
          this.router.navigate(['/sign-in']).then();
        },
        error: (error) => {
          console.error(`Error while signing up: ${error}`);
          this.router.navigate(['/sign-up']).then();
        }
      });
  }

  /**
   * Sign in a user.
   * @param signInRequest The sign in request.
   * @returns The sign in response.
   */
  signIn(signInRequest: SignInRequest) {
    console.log(signInRequest);
    return this.http.post<SignInResponse>(`${this.basePath}/authentication/sign-in`, signInRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          this.signedIn.next(true);
          this.signedInUserId.next(response.id);
          this.signedInUsername.next(response.username);
          localStorage.setItem('token', response.token);
          const rawRole = response.roles && response.roles.length > 0 ? response.roles[0] : '';
          const normalizedRole = this.normalizeRole(rawRole);
          this.signedInUserRole.next(normalizedRole);
          localStorage.setItem('userRole', normalizedRole);

          //console.log(`Signed in as ${response.username} with token ${response.token}`);
          console.log(`User logged in with role: ${normalizedRole}`);
          console.log(`User logged with id ${response.id} and username ${response.username}`);
          // Redirección según rol
          if (normalizedRole === 'ROLE_ADMIN') {
            this.router.navigate(['/dashboard']).then();
          } else {
            this.router.navigate(['/']).then(); // Ruta por defecto
          }
          this.router.navigate(['/']).then();
        },
        error: (error) => {
          this.signedIn.next(false);
          this.signedInUserId.next(0);
          this.signedInUsername.next('');
          console.error(`Error while signing in: ${error}`);
          this.router.navigate(['/sign-in']).then();
        }
      });
  }

  /**
   * Sign out a user.
   *
   * This method signs out a user by clearing the token from local storage and navigating to the sign-in page.
   */
  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInUsername.next('');
    this.signedInUserRole.next('');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.router.navigate(['/sign-in']).then();
  }

  private normalizeRole(role: string): string {
    if (role === 'ROLE_ADMIN') return 'ROLE_ADMIN';
    if (role === 'ROLE_USER') return 'ROLE_USER';
    return '';
  }
}

