import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../schema/user';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css']
})
export class UserpageComponent implements OnInit {
  user: User;

  constructor(private authService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.user = this.authService.getUser();
    } else {
      this.router.navigate([ '/login' ]);
    }
  }
}
