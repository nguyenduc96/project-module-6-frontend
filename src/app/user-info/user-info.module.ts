import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserInfoComponent } from './user-info.component';
import {RouterModule} from '@angular/router';
import {UserInfoRoutingModule} from './user-info-routing.module';
import {FormsModule} from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';


@NgModule({
  declarations: [
    UserInfoComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    UserInfoRoutingModule,
    RouterModule,
    FormsModule,
  ]
})
export class UserInfoModule { }
