import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home.component';
import {AuthGuard} from '../login/helper/AuthGuard';


const routes: Routes = [
  {
    path: 'user',
    canActivate: [AuthGuard],
    loadChildren: () => import('../user-info/user-info.module').then(m => m.UserInfoModule)
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
   loadChildren: () => import('../layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: 'tasks',
    canActivate: [AuthGuard],
    loadChildren: () => import('../task/task.module').then(m => m.TaskModule)
  },
  {
    path: 'status',
    canActivate: [AuthGuard],
    loadChildren: () => import('../status/status.module').then(module => module.StatusModule)
  },
  {
    path: 'projects',
    canActivate: [AuthGuard],
    loadChildren: () => import('../project/project.module').then(module => module.ProjectModule)
  },
  {
    path: 'boards',
    canActivate: [AuthGuard],
    loadChildren: () => import('../board/board.module').then(module => module.BoardModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
