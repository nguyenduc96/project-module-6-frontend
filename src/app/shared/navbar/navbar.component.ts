import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {User} from '../../model/user';
import {ChangePassword} from '../../model/change-password';
import {AngularFireStorage} from '@angular/fire/storage';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User;

  constructor(private storage: AngularFireStorage,
              private _authenticationService: AuthenticationService,
              private _userService: UserService,
              private router: Router) {
    this.getUser();
  }


  ngOnInit(): void {
  }


  getUser() {
    this._userService.getUser().subscribe(
      (user) => {
        this.user = user;
      });
  }


  logout() {
    this._authenticationService.logout();
    this.router.navigateByUrl("/login");
  }

}
