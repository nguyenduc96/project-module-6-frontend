import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {StatusService} from '../../service/status.service';
import {error} from 'protractor';
import {Board} from '../../model/board';

@Component({
  selector: 'app-create-status',
  templateUrl: './create-status.component.html',
  styleUrls: ['./create-status.component.css']
})
export class CreateStatusComponent implements OnInit {
  statusForm: FormGroup = new FormGroup({
    title: new FormControl(),
    position: new FormControl(),
    board: new FormControl()
  });
  boards: Board[] = [];


  constructor(private statusService: StatusService) {
  }

  ngOnInit() {
  }

  save() {
    const stt = this.statusForm.value;
    stt.board = {
      id: stt.board
    };
    this.statusService.saveStatus(stt).subscribe(() => {
      this.statusForm.reset();
      console.log('created');
    }, e => console.log(e));
  }


}
