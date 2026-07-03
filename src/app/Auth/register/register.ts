import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, public auth: Auth) {}

  ngOnInit() {
    // create reactive form group for registration with email, password and confirm pw fields
    this.registerForm = this.fb.group({
      email: ['', { 
        validators: [Validators.required, Validators.email],
        // asynchronously checks if the email already exists
        asyncValidators: [this.emailExistsValidator.bind(this)]
      }],
      password: ['', { 
        validators: [Validators.required, Validators.minLength(6)]
      }],
      confirmPassword: ['', {
        // synchronously checks if password and confirm password values match
        validators: [Validators.required, this.passwordMatchValidator.bind(this)]
      }]
    });

    // when password value changes, revalidate confirm password field, 
    // without this, changing password after setting confirm pw would not trigger validator 
    // => softlock submit button
    this.password.valueChanges.subscribe(() => {
      this.confirmPassword.updateValueAndValidity();
    });
  }

  // getters for easy access to form controls
  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  // sync custom validator
  passwordMatchValidator(control: any) {
    // when confirm pw is empty and password value never changed, no error
    if (!control.value || this.password.pristine) {
      return null;
    }
    // password == confirm password check
    if (this.password.value !== this.confirmPassword.value) {
      // set error if the values do not match
      return { passwordMismatch: true };
    }
    // when check passes, remove error
    return null;
  }

  async emailExistsValidator(control: any) {
    // Only run async check if not empty and sync validators (required, email) 
    // are valid to prevent unnecessary DB calls
    if (!this.email.value || this.email.errors) {
      console.log('Skipping email existence check due to validation errors.');
      return null;
    }
    
    console.log('Checking if email exists:', this.email.value);
    // waits for the answer from the emailexist check from the authservice
    const exists = await this.authService.EmailExists(this.email.value);
    console.log('Email exists:', exists);
    if(exists) {
      // when it exists, set the error
      console.log('Email existence validation error returned.');
      return { emailExists: true };
    }
    return null;
  }
    

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value);
      // calls the register function from authservice with the entered email and password
      this.authService.Register(this.email.value, this.password.value)
        //handles the result async
        .then(result => {
          // because of the onAuthStateChanged listener in authservice, we will be routed to games
          if (result === "success") {
            console.log("Registration successful");
          } else {
            console.error("Registration failed:", result);
          }
        });

      // resets form to prevent accidental resubmission when clicking fast
      this.registerForm.reset();
    }
  }
}
