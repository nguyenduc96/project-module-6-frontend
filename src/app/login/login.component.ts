import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';
import {Router} from '@angular/router';
import {User} from '../model/user';
import {NgForm} from '@angular/forms';
import {showToastError, showToastSuccess} from '../note';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = {};

  isShowPassword: boolean = false;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
  }

  login(formLogin: NgForm) {
    this.user = formLogin.value;
    this.authenticationService.login(this.user.username, this.user.password).subscribe(() => {
      console.log('login success');
      let title = 'Đăng nhập thành công';
      showToastSuccess(title);
      this.router.navigateByUrl("/home");
    }, error => {
      let title = 'Thông báo';
      let content = 'Tên đăng nhập hoặc mật khẩu không đúng';
      showToastError(title, content);
    });
  }

  changeShowPass() {
    this.isShowPassword = !this.isShowPassword;
  }
}
