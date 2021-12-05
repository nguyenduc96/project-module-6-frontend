import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home.component';


const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('../user-info/user-info.module').then(m => m.UserInfoModule)
  }, {
    path: 'tasks',
    loadChildren: () => import('../task/task.module').then(module =>(module.TaskModule))
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
