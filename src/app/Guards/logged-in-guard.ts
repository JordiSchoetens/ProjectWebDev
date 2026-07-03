import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Auth/auth-service';
import { onAuthStateChanged } from 'firebase/auth';

export const loggedInGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // made this way, otherwise, login page would first be loaded on refresh, 
  // then redirected when already logged in
  // because it takes some time for firebase to populate currentuser

  // creates promise that resolves when auth state is known, 
  // it uses onauthstatechanged to listen for auth state changes
  const user = await new Promise(resolve => {
    const unsub = onAuthStateChanged(authService.auth, user => {
      // stop listening after first event
      unsub();
      // resolve promise with user object
      resolve(user);
    });
  });

  // if user logged in, allow access, else redirect login page
  if (user) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
