import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {User} from '../../model/user';
import {ChangePassword} from '../../model/change-password';
import {AngularFireStorage} from '@angular/fire/storage';
import {UserService} from '../../service/user.service';
import {Observable} from 'rxjs';
import {showToastError, showToastNotice, showToastSuccess} from '../../note';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  selectedFile: File = null;
  avatar: string;
  downloadURL: Observable<string>;
  currentUser: any;
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
              console.log(this.avatar);
              this._userService.setAvatar(this.avatar).subscribe(
                (user) => {
                  this.user = user;
                  let title = "Cập nhật ảnh đại diện thành công";
                  showToastSuccess(title)
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
}
