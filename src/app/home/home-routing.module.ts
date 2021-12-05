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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
