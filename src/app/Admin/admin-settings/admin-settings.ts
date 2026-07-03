import { Component } from '@angular/core';
import { UserModel } from '../../Models/user-model';
import { Subscription } from 'rxjs';
import { AdminService } from '../admin-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { FilterUserPipePipe } from '../../Pipes/filter-user-pipe-pipe';

@Component({
  selector: 'app-admin-settings',
  imports: [FormsModule, FilterUserPipePipe],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css',
})
export class AdminSettings {

  Users: UserModel[] = [];
  Admins: UserModel[] = [];
  subUsers?: Subscription;
  subAdmins?: Subscription;
  searchUser: string = '';
  searchAdmin: string = '';

  constructor(private adminService: AdminService, private snackBar: MatSnackBar, public auth: Auth) {}

  async ngOnInit(): Promise<void> {
    this.Users = [];
    this.Admins = [];
    this.LoadAdmins();
  }

  LoadUsers() {
    // calls getallusers and subs to the returned observable, must sub in order to get executed
    this.subUsers = this.adminService.GetAllUsers()
    .subscribe({
      // when users change, user list is updated
      next: (users) => {
        this.Users = users;
        // filters out the admins
        this.Users = this.Users.filter(u => !this.Admins.some(a => a.Id === u.Id));
        // prevents "Cannot read properties of null" error when logging out
        if(this.auth.currentUser){
          // filters out the logged in admin
          this.Users = this.Users.filter(u => u.Id !== this.auth.currentUser!.uid);
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  LoadAdmins() {
    // calls getalladmins and subs to the returned observable, must sub in order to get executed
    this.subAdmins = this.adminService.GetAllAdmins()
    .subscribe({
      // when admins change, admin list is updated
      next: (admins) => {
        this.Admins = admins;
        // filters out the logged in admin
        this.Admins = this.Admins.filter(a => a.Id !== this.auth.currentUser!.uid);
        // reloads users to update the user list, users is never changed when making admin/revoking admin, 
        // so it would not update the list
        // making/revoking admins only updates the Admins collection, not the Users collection
        this.LoadUsers();
      },
      error: (err) => {
        console.error('Error fetching admins:', err);
      }
    });
  }

  MakeAdmin(userId: string, email: string) {
    // calls makeadmin and subs to the returned observable, must sub to get executed
    // automatically unsubs after execution
    this.adminService.MakeAdmin(userId, email).subscribe(() => {
      this.snackBar.open('User made admin successfully!', undefined, { duration: 3000, panelClass: 'snack-success' });
      console.log(`User with ID ${userId} made admin.`);
    });
  }

  RevokeAdmin(userId: string) {
    // calls revokeadmin and subs to the returned observable, must sub to get executed
    // automatically unsubs after execution
    this.adminService.RevokeAdmin(userId).subscribe(() => {
      this.snackBar.open('Admin revoked successfully!', undefined, { duration: 3000, panelClass: 'snack-success' });
      console.log(`Admin with ID ${userId} revoked.`);
    });
  }

  ngOnDestroy(): void {
    // unsubs both subs to prevent memory leaks
    this.subUsers?.unsubscribe();
    this.subAdmins?.unsubscribe();
  }

}
