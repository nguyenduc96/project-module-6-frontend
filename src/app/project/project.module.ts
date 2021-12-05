import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import {ProjectComponent} from './project.component';
import {FormsModule} from '@angular/forms';
import { DetailComponent } from './detail/detail.component';


@NgModule({
  declarations: [
    ProjectComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    FormsModule
  ]
})
export class ProjectModule { }
