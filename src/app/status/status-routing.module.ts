import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ShowStatusComponent} from './show-status/show-status.component';
import {CreateStatusComponent} from './create-status/create-status.component';
import {EditStatusComponent} from './edit-status/edit-status.component';
import {DeleteStatusComponent} from './delete-status/delete-status.component';
import {ViewStatusComponent} from './view-status/view-status.component';


const routes: Routes = [
  {
    path: 'list',
    component: ShowStatusComponent
  }, {
  path: 'create',
    component: CreateStatusComponent
  }, {
  path: 'edit/:id',
    component: EditStatusComponent
  }, {
  path: 'delete/:id',
    component: DeleteStatusComponent
  }, {
  path: 'view/:id',
    component: ViewStatusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusRoutingModule { }
