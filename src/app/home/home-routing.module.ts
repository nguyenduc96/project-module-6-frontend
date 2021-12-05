import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home.component';


const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('../user-info/user-info.module').then(m => m.UserInfoModule)
  },
  {
    path: 'home',
   loadChildren: () => import('../layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: 'tasks',
    loadChildren: () => import('../task/task.module').then(m => m.TaskModule)
  },
  {
    path: 'status',
    loadChildren: () => import('../status/status.module').then(module => module.StatusModule)
  },
  // {
  //   path: 'projects',
  //   loadChildren: () => import('../project/project.module').then(module => module.ProjectModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
