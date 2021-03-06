import { Router } from '@angular/router';
import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  loggedIn: Observable<boolean>;
  hasLocation: Observable<boolean>;

  constructor(
    public authService: AuthenticationService) {
    this.loggedIn = authService.isLoggedIn();
    this.hasLocation = authService.getLocation();
    if (authService.lastLocation == null && authService.getToken() != null)
      authService.fetchLastLocation();
  }
}
