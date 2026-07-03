import { EnvironmentInjector, Injectable, runInInjectionContext } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, onAuthStateChanged, signInWithEmailAndPassword } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserModel } from '../Models/user-model';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // subject that holds and emits the admin status
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  // exposes the private subject as a public observable so other components can sub to it, NavBar does this
  public isAdmin$ = this.isAdminSubject.asObservable();
  
  constructor(public auth: Auth, private injector: EnvironmentInjector, private firestore: Firestore, private router: Router) 
  {
    // firebase auth state listener, listens for changes to the users login state
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        // when logged in, check if admin and navigate to games, without this, when refreshing,
        // the app would forget if the user was admin or not and break it
        await this.IsAdmin();
        this.router.navigate(['Games']);
      } else {
        // when were not logged in were definitely not an admin
        this.isAdminSubject.next(false);
      }
    });
  }

  Register(email: string, password: string): Promise<string> {
    // makes sure the firebase code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // calls firebase function to create new user with email and password
      return createUserWithEmailAndPassword(this.auth, email, password)
      // if successful, add the user to Users collection, needed for dynamic admins
      .then(async () => {
        // waits for the adduser function to complete
        await this.AddUser();
        return "success";
      })
      .catch(error => {
        return error.message;
      });
    });
  }

  // had to change firebase authentication settings, disabled email enumeration, 
  // otherwise firebase would reply with an empty array
  EmailExists(email: string): Promise<boolean> {
    // makes sure the firebase code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // gets the signin methods for the given email
      return fetchSignInMethodsForEmail(this.auth, email)
      // handles result when succes
      .then(methods => {
        console.log('Sign-in methods for', email, ':', methods);
        // returns true when at least 1 signin method exists for this email
        return methods.length > 0;
      })
      .catch((error) => {
        // email doesnt exist or other error, in retrospect this isnt the best way, now when firebase errors
        // the email will be considered non-existing, we just assume firebase doesnt error
        console.error('Error checking email:', error);
        return false;
      });
    });
  }
  
  Login(email: string, password: string): Promise<boolean> {
    // makes sure the firebase code is run within the correct angular injection context
    return runInInjectionContext(this.injector, async () => {
      // calls firebase function to sign in with email and password
      return signInWithEmailAndPassword(this.auth, email, password)
        .then(async () => {
          // when successful, await check if admin
          await this.IsAdmin();
          return true;
        })
        .catch((error) => {
          console.error('Login error:', error);
          return false;
        });
    });
  }

  Logout(): void {
    // uses firebase signout function
      this.auth.signOut();
  }

  IsLoggedIn(): boolean {
    // checks if user is logged in
      return this.auth.currentUser != null;
  }

  async IsAdmin(): Promise<void> {
    // prevents error for adminDoc, possible NULL value
    if (!this.auth.currentUser) {
      this.isAdminSubject.next(false);
      return;
    }

    // ref to the admin doc with the current users id
    const adminDoc = doc(this.firestore, `Admins/${this.auth.currentUser.uid}`);
    // gets the doc
    const adminSnap = await getDoc(adminDoc);
    // sets the subject to true/false based on the existence of the doc
    this.isAdminSubject.next(adminSnap.exists());
  }

  AddUser() {
    const user: UserModel = {
      // gets the email of the currently logged in user, which is the newly registered user
      Email: this.auth.currentUser!.email!
    };
    // makes sure the firestore code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // reference to the user doc with the current users id
      const Ref = doc(this.firestore, `Users/${this.auth.currentUser!.uid}`);
      // writes the user model to the referenced doc, doesnt exist yet, so creates it
      return from(setDoc(Ref, user));
    });
  }

}