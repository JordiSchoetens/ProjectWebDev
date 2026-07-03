import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

export const isAdminGuard: CanActivateFn = async (route, state) => {
  // inject necessary services
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  // if not logged in, redirect to login page
  if (!auth.currentUser) {
    router.navigate(['/']);
    return false;
  }

  // get reference to document that has current user id as doc ID
  const adminDoc = doc(firestore, `Admins/${auth.currentUser.uid}`);
  // get the document snapshot
  const adminSnap = await getDoc(adminDoc);

  // checks if the document exists
  if (adminSnap.exists()) {
    return true;
  } else {
    router.navigate(['Games']);
    return false;
  }
};
