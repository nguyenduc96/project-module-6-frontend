import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Trello';

  currentUser: any;

  constructor(public _authenticationService: AuthenticationService) {
    this._authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

}

