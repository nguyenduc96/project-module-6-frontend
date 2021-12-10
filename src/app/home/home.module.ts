import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {UserInfoModule} from '../user-info/user-info.module';
import {TaskModule} from "../task/task.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeRoutingModule,
    RouterModule,
    UserInfoModule,
    SharedModule,
  ]
})
export class HomeModule { }
