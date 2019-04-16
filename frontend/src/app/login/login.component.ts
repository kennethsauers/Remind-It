import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationResponse, UserInformation } from '../schema/authentication';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(16)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(16)
    ])
  });

  private _error = new Subject<string>();
  message: string;

  /**
   * @params authService AuthenticationService injection
   * @params router Router injection
   */
  constructor(private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    this._error.subscribe((msg) => { this.message = msg; });
    this._error.pipe(
      debounceTime(5000)
    ).subscribe(() => this.message = null);
  }

  onSubmit() {
    const userInformation: UserInformation = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    };

    this.authService.doLogin(userInformation).subscribe((res: AuthenticationResponse) => {
      if (res.success) {
        this.authService.handleAuthenticationResponse(res);
        this.router.navigate(['/userpage']);
      } else {
        this._error.next(res.msg);
      }
    });
  }
}
