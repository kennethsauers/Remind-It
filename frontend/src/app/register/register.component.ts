import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { AuthenticationService } from '../services/authentication.service';
import { RegisterResponse, UserInformation } from '../schema/authentication';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(16)
    ]),
    email: new FormControl('', [
      Validators.maxLength(32),
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(256)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.maxLength(256)
    ])
  });

  private _success = new Subject<String>();
  success: Boolean;
  message: String;

  checkPasswords(): boolean {
    const pass = this.registerForm.get('password').value;
    const confirmPass = this.registerForm.get('confirmPassword').value;

    return pass === confirmPass;
  }

  /**
   * @params authService AuthenticationService injection
   * @params router Router injection
   */
  constructor(public authService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    this._success.subscribe( (msg) => { this.message = msg });
    this._success.pipe(
      debounceTime(5000)
    ).subscribe( () => {
      this.success = null;
    });
    
  }

  onSubmit() {
    const userInformation: UserInformation = {
      username : this.registerForm.get('username').value,
      email : this.registerForm.get('email').value,
      password : this.registerForm.get('password').value
    };

    this.authService.doRegister(userInformation).subscribe( (res: RegisterResponse) => {
        if (res.success)
          this.router.navigate(['/login']);
        this.success = res.success;
        this._success.next(res.msg);
    });
  }
}
