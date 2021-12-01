import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import {HomeComponent} from './home.component';
import {UserInfoModule} from '../user-info/user-info.module';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    UserInfoModule,
    RouterModule,
  ]
})
export class HomeModule { }
