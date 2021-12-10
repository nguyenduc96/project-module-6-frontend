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
import {SocketService} from "../../service/socket.service";
import {Notification} from "../../model/notification";
import {NotificationService} from "../../service/notification.service";
import {Board} from "../../model/board";
import {BoardService} from "../../service/board/board.service";

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
  notification: Notification[];
  board: Board[];
  isCheckNoti: boolean = true;
  searchTitleBoard;
  constructor(private storage: AngularFireStorage,
              private _authenticationService: AuthenticationService,
              private _userService: UserService,
              private router: Router,
              private socketService: SocketService,
              private notificationService: NotificationService,
              private boardService: BoardService) {
    this.getUser();
  }


  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user'));
    this.socketService.getCurrentNotification(user.id);
    this.socketService.connectToNotificationByUserId(user.id);
    this.socketService.notification.subscribe(data => {
      this.notification = data;
      this.isCheckNoti = false;
      console.log(data);
    });
    this.getAllBoard();
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

  getAllBoard() {
    this.boardService.getAll().subscribe(data => {
      this.board = data;
    })
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

  markAsRead(id: number) {
    let user = JSON.parse(localStorage.getItem('user'));
    this.notificationService.markAsReadNoti(id).subscribe(() => {
      this.socketService.getCurrentNotification(user.id);
    })
  }

  // checkNotification() {
  //   for(let noti of this.notification) {
  //     if(noti.status == false) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  readNoti() {
    this.isCheckNoti = true;
  }

  resetSearch() {
    this.searchTitleBoard = '';
  }
}
