import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusRoutingModule } from './status-routing.module';
import { ShowStatusComponent } from './show-status/show-status.component';
import { CreateStatusComponent } from './create-status/create-status.component';
import { EditStatusComponent } from './edit-status/edit-status.component';
import { DeleteStatusComponent } from './delete-status/delete-status.component';
import {ReactiveFormsModule} from '@angular/forms';
import { ViewStatusComponent } from './view-status/view-status.component';


@NgModule({
  declarations: [ShowStatusComponent, CreateStatusComponent, EditStatusComponent, DeleteStatusComponent, ViewStatusComponent],
  imports: [
    CommonModule,
    StatusRoutingModule,
    ReactiveFormsModule
  ]
})
export class StatusModule { }
