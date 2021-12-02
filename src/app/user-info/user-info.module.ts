import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserInfoComponent } from './user-info.component';
import {RouterModule} from '@angular/router';
import {UserInfoRoutingModule} from './user-info-routing.module';


@NgModule({
  declarations: [
    UserInfoComponent,
  ],
  imports: [
    CommonModule,
    UserInfoRoutingModule,
    RouterModule,
  ]
})
export class UserInfoModule { }
