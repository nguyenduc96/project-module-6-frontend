import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import {TaskComponent} from './task.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProjectModule} from '../project/project.module';


@NgModule({
  declarations: [
    TaskComponent
  ],
    imports: [
        CommonModule,
        TaskRoutingModule,
        DragDropModule,
        ReactiveFormsModule,
        FormsModule,
        ProjectModule
    ]
})
export class TaskModule { }
