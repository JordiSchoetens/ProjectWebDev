import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { AuthService } from '../auth-service';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from "../../../environments/environment";

// fdescribe so only these test are run
fdescribe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['EmailExists', 'Register']);
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  function setFormValues(email: string, password: string, confirmPassword: string) {
    component.registerForm.setValue({ email, password, confirmPassword });
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Positive: Should keep form pristine and untouched after initialization
  it('should keep form pristine and untouched after initialization', () => {
    expect(component.registerForm.pristine).toBeTrue();
    expect(component.registerForm.untouched).toBeTrue();
    Object.values(component.registerForm.controls).forEach(control => {
      expect(control.pristine).toBeTrue();
      expect(control.untouched).toBeTrue();
    });
  });

  // Positive: Should not show any error messages when form is valid
  it('should not show any error messages when form is valid', async () => {
    authServiceSpy.EmailExists.and.returnValue(Promise.resolve(false));
    setFormValues('valid@example.com', 'Password123!', 'Password123!');
    await component.registerForm.controls['email'].updateValueAndValidity();
    await fixture.whenStable();
    expect(component.registerForm.valid).toBeTrue();
    Object.values(component.registerForm.controls).forEach(control => {
      expect(control.errors).toBeNull();
    });
  });

  // Positive: Should reset form after successful registration
  it('should reset form after successful registration', async () => {
    authServiceSpy.Register.and.returnValue(Promise.resolve('success'));
    authServiceSpy.EmailExists.and.returnValue(Promise.resolve(false));
    setFormValues('valid@example.com', 'Password123!', 'Password123!');
    spyOn(component.registerForm, 'reset');
    await component.registerForm.controls['email'].updateValueAndValidity();
    await fixture.whenStable();
    await component.onSubmit();
    expect(component.registerForm.reset).toHaveBeenCalled();
  });

  // Negative: Should show emailExists error if email is already taken
  it('should show emailExists error if email is already taken', async () => {
    authServiceSpy.EmailExists.and.returnValue(Promise.resolve(true));
    setFormValues('valid@example.com', 'Password123!', 'Password123!');
    await fixture.whenStable();
    await component.registerForm.controls['email'].updateValueAndValidity();
    await fixture.whenStable();
    expect(component.registerForm.controls['email'].errors).toEqual({ emailExists: true });
  });

  // Negative: Should set passwordMismatch error if passwords do not match
  it('should set passwordMismatch error if passwords do not match', async () => {
    setFormValues('test@example.com', 'Password123!', 'DifferentPassword!');
    await fixture.whenStable();
    expect(component.registerForm.controls['confirmPassword'].errors).toEqual({ passwordMismatch: true });
  });
});
