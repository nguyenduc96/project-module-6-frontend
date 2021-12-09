import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from './navbar/navbar.component';
import {FooterComponent} from './footer/footer.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {RouterModule} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {SearchBoardFillterPipe} from "../project/search-board-fillter.pipe";



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
    SearchBoardFillterPipe,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    SidebarComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    Ng2SearchPipeModule,
  ]
})
export class SharedModule { }
