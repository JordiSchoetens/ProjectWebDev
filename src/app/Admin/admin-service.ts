import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { from } from 'rxjs';
import { UserModel } from '../Models/user-model';
import { collection, collectionData, CollectionReference, doc, Firestore, setDoc, deleteDoc, query, where, documentId } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  
  constructor(private injector: Injector, private firestore: Firestore, private auth: Auth) { }

  GetAllUsers() {
    // makes sure the firestore code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // gets a reference to the Users collection
      const UsersPath = collection(this.firestore, 'Users') as CollectionReference<UserModel>;
      console.log("Loading all Users");
      // returns an observable that emits the list of users, 
      // and maps the doc ID to the Id field of the UserModel
      return collectionData<UserModel>(UsersPath, { idField: 'Id' });
    });
  }

  GetAllAdmins() {
    // makes sure the firestore code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // gets a reference to the Admins collection
      const AdminsPath = collection(this.firestore, 'Admins') as CollectionReference<UserModel>;
      console.log("Loading admins");
      // returns an observable that emits the list of admins, 
      // and maps the doc ID to the Id field of the UserModel
      return collectionData<UserModel>(AdminsPath, { idField: 'Id' });
    });
  }

  MakeAdmin(userId: string, Email: string) {
    // makes sure the firestore code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // creates a reference to the document that has the userId as ID, doesnt exist yet, so creates it
      const UserPath = doc(this.firestore, `Admins/${userId}`);
      // write the user email to the referenced document and returns an observable
      return from(setDoc(UserPath, { Email }));
    });
  }

  RevokeAdmin(userId: string) {
    // makes sure the firestore code is run within the correct angular injection context
    return runInInjectionContext(this.injector, () => {
      // gets a reference to the document that has the userId as ID
      const UserDoc = doc(this.firestore, `Admins/${userId}`);
      // deletes the referenced doc and returns an observable
      return from(deleteDoc(UserDoc));
    });
  }

}
