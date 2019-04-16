import { Router } from '@angular/router';
import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedIn: Observable<boolean>;
  hasLocation: Observable<boolean>;

  constructor(private router: Router,
              public authService: AuthenticationService) {
                this.loggedIn = authService.isLoggedIn();
                this.hasLocation = authService.getLocation();
    if (authService.lastLocation == null)
      authService.fetchLastLocation();
  }

  ngOnInit() {
  }
}
