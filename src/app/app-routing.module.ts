import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './login/helper/AuthGuard';
import {HomeComponent} from './home/home.component';



const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeComponent,
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'status',
    canActivate: [AuthGuard],
    loadChildren: () => import('./status/status.module').then(module => module.StatusModule)
  }, {
  path: 'tasks',
    canActivate: [AuthGuard],
    loadChildren: () => import('./task/task.module').then(module =>(module.TaskModule))
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
