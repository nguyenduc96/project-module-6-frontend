import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isShowPassword: boolean = false;
  isShowConfirmPassword: boolean = false;

  user: FormGroup = new FormGroup(
    {
      username: new FormControl(),
      password: new FormControl(),
      email: new FormControl(),
    }
  )

  avatar: any;

  constructor(private _userService: UserService) { }

  ngOnInit() {
  }

  register() {
    const formData = new FormData();
    formData.append('username', this.user.get('username').value);
    formData.append('password', this.user.get('password').value);
    formData.append('email', this.user.get('email').value);
    formData.append('avatar', this.avatar);
    this._userService.registerAccount(formData).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    )
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

  getImage($event: Event) {
    this.avatar = $event.target['files'][0];
    console.log(this.avatar);
  }
}
