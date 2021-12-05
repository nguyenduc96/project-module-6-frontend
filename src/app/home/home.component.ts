import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: any;

  constructor(public _authenticationService: AuthenticationService,
              private _router: Router) {
    this._authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser == null) {
      this._authenticationService.logout();
      this._router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
  }

}
