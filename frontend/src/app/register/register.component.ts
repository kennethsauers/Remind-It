import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { AuthenticationService } from '../services/authentication.service';
import { RegisterResponse, UserInformation } from '../schema/authentication';

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
  }

  onSubmit() {
    const userInformation: UserInformation = {
      username : this.registerForm.get('username').value,
      email : this.registerForm.get('email').value,
      password : this.registerForm.get('password').value
    };

    this.authService.doRegister(userInformation).subscribe( (res: RegisterResponse) => {
      if (res.success) {
        /// TODO: Congratulate the user on logging in, very wow
        this.router.navigate(['/login']);
      } else {
        console.log('register failed: ', res.msg);
      }
    });
  }
}
