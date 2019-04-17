import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../schema/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css']
})
export class UserpageComponent implements OnInit {
  user: User;

  changePasswordForm = new FormGroup({
    newPass: new FormControl('', [
      Validators.required,
      Validators.maxLength(256)
    ]),
    newPassConfirm: new FormControl('', [
      Validators.required,
      Validators.maxLength(256)
    ])
  });
  deleteAccountForm = new FormGroup({
    deleteAccountConfirm: new FormControl('', [
      Validators.required,
      Validators.maxLength(256)
    ])
  });

  constructor(private authService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.user = this.authService.getUser();
    } else {
      this.router.navigate([ '/login' ]);
    }
  }

  onDeleteAccountSubmit() {

  }

  onChangePasswordSubmit() {
    
  }
}
