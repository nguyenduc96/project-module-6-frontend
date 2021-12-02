import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {AuthenticationService} from '../service/authentication.service';
import {UserService} from '../service/user.service';
import {User} from '../model/user';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  title = 'cloudsSorage';
  selectedFile: File = null;
  avatar: string;
  downloadURL: Observable<string>;
  currentUser: any;
  user: User;

  constructor(private storage: AngularFireStorage,
              private _authenticationService: AuthenticationService,
              private _userService: UserService) {
    this.getUser();

  }

  getUser() {
    this._userService.getUser().subscribe(
      (user) => {
        console.log(user);
        this.user = user;
        console.log(this.user);
      });
  }

  ngOnInit() {

  }

  onFileSelected(event) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);

    task.snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.avatar = url;
              this.avatar = JSON.stringify(this.avatar);
              console.log(this.avatar);
              this._userService.setAvatar(this.avatar).subscribe(
                (user) => {
                  this.user = user;
                  console.log(this.user);
                });
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }
}
