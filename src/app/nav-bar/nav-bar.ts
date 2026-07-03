import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../Auth/auth-service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {

  showAdminLink: boolean = false;

  constructor(public auth: Auth, private router: Router, public authService: AuthService) {
    // subs to the admin observable from the authservice, whenever subject changes, updates showAdminLink
    authService.isAdmin$.subscribe(isAdmin => {
      this.showAdminLink = isAdmin;
    });
  }

  logout() {
    this.authService.Logout();
    this.router.navigate(['/']);
  }



}
