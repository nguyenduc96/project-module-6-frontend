import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {AuthenticationService} from '../service/authentication.service';
import {UserService} from '../service/user.service';
import {User} from '../model/user';
import {showToastError, showToastNotice, showToastSuccess} from '../note';
import {ChangePassword} from '../model/change-password';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

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
              private _userService: UserService,
              private _router: Router) {
    this._authenticationService.currentUser.subscribe(us => this.currentUser = us);
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
    let text = 'Đang cập nhật ảnh đại diện'
    showToastNotice(text);
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
              this._userService.setAvatar(this.avatar).subscribe(
                (user) => {
                  this.user = user;
                  let title = "Cập nhật ảnh đại diện thành công";
                  showToastSuccess(title);
                });
            }
          }, () => {
            let title = "Cập nhật ảnh đại diện thất bại";
            showToastError(title)
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  // private getUserByProjectId(id: number) {
  //     this.board = data;
  //     this.getLabels();
  //   }, error => {
  //     console.log('Error');
  //   });
  // }
}
