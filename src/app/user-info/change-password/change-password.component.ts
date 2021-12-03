import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {showToastError, showToastSuccess} from '../../note';
import {AuthenticationService} from '../../service/authentication.service';
import {UserService} from '../../service/user.service';
import {ChangePassword} from '../../model/change-password';
import {User} from '../../model/user';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  user: User;
  changePassword: ChangePassword = {};

  constructor( private _authenticationService: AuthenticationService,
               private _userService: UserService,) { }

  ngOnInit() {
  }

  changePass(formChangePass: NgForm) {
    if (!this.checkRePassword()) {
      this.changePassword = formChangePass.value;
      this._userService.changePassword(this.changePassword).subscribe(
        (user) => {
          this.user = user;
          let title = "Cập nhật mật khẩu thành công";
          formChangePass.reset();
          showToastSuccess(title)
        }, () => {
          let title = "Cập nhật mật khẩu thất bại";
          showToastError(title)
          formChangePass.reset();
        });
    } else {
      let title = "Mật khẩu không khớp";
      formChangePass.reset();
      showToastError(title)
    }
  }

  checkRePassword(): boolean {
    let rePassword = document.getElementById('confirmPassword') as HTMLInputElement;
    return rePassword.value === '' || undefined || null;
  }

  checkConfirmPassWord() {
    let password = document.getElementById('newPassword') as HTMLInputElement;
    let rePassword = document.getElementById('confirmPassword') as HTMLInputElement;
    let result = '';
    if (password.value !== rePassword.value) {
      result = 'Mật khẩu không khớp';
    } else {
      result = '';
    }
    document.getElementById('confirm-password-error').innerHTML = result;
  }
}
