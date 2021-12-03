import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {UserService} from '../service/user.service';
import {User} from '../model/user';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {showToastError, showToastSuccess} from '../note';
import {AuthenticationService} from '../service/authentication.service';

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

  constructor(private _userService: UserService,
              private _router: Router,
              private _authenticationService: AuthenticationService) {
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
        showToastError(title, content);
        console.log(error);
      }
    );
  }

  showPassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  showConfirmPassword() {
    this.isShowConfirmPassword = !this.isShowConfirmPassword;
  }

  checkRePassword(): boolean {
    let rePassword = document.getElementById('re-password-field') as HTMLInputElement;
    return rePassword.value === '' || undefined || null;
  }

  checkConfirmPassWord() {
    let password = document.getElementById('password-field') as HTMLInputElement;
    let rePassword = document.getElementById('re-password-field') as HTMLInputElement;
    let result = '';
    if (password.value !== rePassword.value) {
      result = 'Mật khẩu không khớp';
    } else {
      result = '';
    }
    document.getElementById('confirm-password-error').innerHTML = result;
  }
}
