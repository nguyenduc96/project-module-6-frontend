import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';



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
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  }, {
    path: 'status',
    loadChildren: () => import('./status/status.module').then(module => module.StatusModule)
  }, {
  path: 'tasks',
    loadChildren: () => import('./task/task.module').then(module =>(module.TaskModule))
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
