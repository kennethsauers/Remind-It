import { Injectable, EventEmitter } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { RegisterResponse, AuthenticationResponse, UserInformation } from '../schema/authentication';
import { User } from '../schema/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  /// TODO: Change according to your setup
  readonly ApiUrl = 'https://localhost/users/';
  //readonly ApiUrl = 'https://themeanteam.site/users';
  lastLocation: Position;

  isLoginSubject = new BehaviorSubject<boolean>(this.getToken() != null);
  isLocationDataValid = new BehaviorSubject<boolean>(this.lastLocation != null);
  
  /**
   * @param http HttpClient injection to make API requests
   */
  constructor(private http: HttpClient) { }

  public getToken(): string {
    /// TODO: Validate the token
    if (localStorage.getItem('token')) {
      return localStorage.getItem('token');
    }
    return null;
  }

  public fetchLastLocation() {
    if (this.lastLocation != null) return;
    navigator.geolocation.watchPosition(
      success => {
        this.lastLocation = success;
        this.isLocationDataValid.next(true);
        return success;
      },
      error => {
        console.log(error);
        this.isLocationDataValid.next(false);
        return null;
      }
    );
  }

  public getLocation(): Observable<boolean> {
    return this.isLocationDataValid.asObservable();
  }

  public getUser(): User {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user'));
    }

    return null;
  }

  /**
   * Returns the status of the logged-in status of the user
   * TODO: Validate token
   */
  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

   /**
    * Makes call to the Api and returns an AuthenticationResponse
    * @param user UserInformation object with the username and password for API call
    */
   doLogin(user: UserInformation) {
    const HttpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    };
    return this.http.post<AuthenticationResponse>(this.ApiUrl + 'auth', user, HttpOptions);
   }

   /**
    * Handles the returning AuthenticationResponse object from the doLogin() API call
    * @param res Response data
    */
   handleAuthenticationResponse(res: AuthenticationResponse) {
    if (!res.success) {
      return;
    }
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('token', res.token);
    this.isLoginSubject.next(true);
  }

  /**
   * Logs the user out and clears all associated data: authenticationToken and User object
   * TODO: Invalidate token
   */
  doLogout() {
    if (this.isLoggedIn()) {
      localStorage.clear();
      this.isLoginSubject.next(false);
    }
  }

  doRegister(user: UserInformation) {
    const HttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<RegisterResponse>(this.ApiUrl + 'reg', user, HttpOptions);
  }
}
