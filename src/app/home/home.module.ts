import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import {HomeComponent} from './home.component';
import {UserInfoModule} from '../user-info/user-info.module';
import {RouterModule} from '@angular/router';
import {AppModule} from '../app.module';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    UserInfoModule,
    RouterModule,
    SharedModule,

  ]
})
export class HomeModule { }
