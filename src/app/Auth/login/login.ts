import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service';
import { Auth } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { AutoFocusInputDirective } from '../../Directives/auto-focus-input-directive';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, AutoFocusInputDirective],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup;
  error: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, public auth: Auth, private router: Router) {}

  ngOnInit() {
    // creates a reactive form group with email and password fields
    this.loginForm = this.fb.group({
      email: ['', {
        validators: [Validators.required, Validators.email]
      }],
      password: ['', {
        validators: [Validators.required]
      }]
    });
  }

  // getters for easy access to form controls
  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // calls the login method from authservice with the entered email and password
      this.authService.Login(this.email.value, this.password.value)
        // handles login async
        .then(result => {
          // when failed
          if(!result) {
            // show error and reset password field
            this.error = true;
            this.password.reset();
          } else {
            // when successful, navigate to games page
            this.error = false;
            this.router.navigate(['Games']);
          }
        });
    }
  }
}
