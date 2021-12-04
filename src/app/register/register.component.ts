import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {UserService} from '../service/user.service';
import {User} from '../model/user';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {showPopupError, showToastSuccess} from '../note';
import {AuthenticationService} from '../service/authentication.service';
import {UserUnique} from '../model/user-unique';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isShowPassword: boolean = false;

  isShowConfirmPassword: boolean = false;

  user: User = {};

  avatar: any;

  userUniques: UserUnique[] = [];

  isUsernameUnique: boolean;

  isEmailUnique: boolean;

  isConfirmPassword: boolean = true;

  constructor(private _userService: UserService,
              private _router: Router,
              private _authenticationService: AuthenticationService) {
    this.getUserUnique();
    if (this._authenticationService.currentUser != null) {
      this._authenticationService.logout();
    }
  }

  ngOnInit() {
  }

  register(formRegister: NgForm) {
    this.user = formRegister.value;
    this._userService.registerAccount(this.user).subscribe(
      (data) => {
        let title = 'Đăng ký thành công';
        this._router.navigateByUrl('/login');
        showToastSuccess(title);
      },
      (error) => {
        let title = 'Thông báo';
        let content = 'Đăng ký thất bại';
        showPopupError(title, content);
        console.log(error);
      }
    );
  }

  getUserUnique() {
    this._userService.getAllUserUniques().subscribe(
      (data) => {
        this.userUniques = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkUsernameUnique() {
    this.isUsernameUnique = true;
    let username = $('#username-field').val();
    if (username != null && username != '') {
      for (let i = 0; i < this.userUniques.length; i++) {
        if (this.userUniques[i].username === username) {
          this.isUsernameUnique = false;
          break;
        }
      }
    }
  }

  checkEmailUnique() {
    let email = $('#email').val();
    this.isEmailUnique = true;
    if (email != null && email != '') {
      for (let i = 0; i < this.userUniques.length; i++) {
        if (this.userUniques[i].email === email) {
          this.isEmailUnique = false;
          break;
        }
      }
    }
  }

  showPassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  showConfirmPassword() {
    this.isShowConfirmPassword = !this.isShowConfirmPassword;
  }

  checkRePassword(): boolean {
    let rePassword = $('#re-password-field').val();
    return rePassword === '' || undefined || null;
  }

  checkConfirmPassWord() {
    let password = $('#password-field').val();
    let rePassword = $('#re-password-field').val();
    this.isConfirmPassword = password === rePassword;
  }
}
