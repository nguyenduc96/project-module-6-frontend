import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserInfoComponent} from './user-info.component';
import {ChangePasswordComponent} from './change-password/change-password.component';


const routes: Routes = [
  {
    path: 'information',
    component: UserInfoComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserInfoRoutingModule { }
