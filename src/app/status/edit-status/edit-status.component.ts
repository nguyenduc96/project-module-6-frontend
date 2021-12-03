import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {StatusService} from '../../service/status.service';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-edit-status',
  templateUrl: './edit-status.component.html',
  styleUrls: ['./edit-status.component.css']
})
export class EditStatusComponent implements OnInit {
  statusForm: FormGroup = new FormGroup({
    title: new FormControl(),
    position: new FormControl(),
    board: new FormControl()
  });
  id: number;

  constructor(private statusService: StatusService,
              private activeRoute: ActivatedRoute) {
    this.activeRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = +paramMap.get('id');
      this.getStatus(this.id);
    });
  }

  ngOnInit() {
  }

  private getStatus(id: number) {
    return this.statusService.findById(id).subscribe(status => {
      this.statusForm = new FormGroup({
        title: new FormControl(status.title),
        position: new FormControl(status.position),
        board: new FormControl(status.board)
      });
    });
  }

  // updateStatus(id: number) {
  //   const stt = this.statusForm.value;
  //   this.statusService.updateStatus(id, stt).subscribe(() => {
  //     alert('updated');
  //   });
  // }
}
