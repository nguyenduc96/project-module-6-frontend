import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import {ProjectComponent} from './project.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DetailComponent } from './detail/detail.component';
import {TestPipe} from '../test.pipe';
import {SearchBoardFillterPipe} from "./search-board-fillter.pipe";
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    ProjectComponent,
    DetailComponent,
    TestPipe,
  ],
    exports: [
        TestPipe,
    ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule
  ]
})
export class ProjectModule { }
