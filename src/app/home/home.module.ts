import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import {HomeComponent} from './home.component';
import {UserInfoModule} from '../user-info/user-info.module';
import {RouterModule} from '@angular/router';
import {AppModule} from '../app.module';
import {SharedModule} from '../shared/shared.module';
import {TaskModule} from '../task/task.module';
import {StatusModule} from '../status/status.module';
import {TaskComponent} from '../task/task.component';


@NgModule({
  declarations: [
    HomeComponent,
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
