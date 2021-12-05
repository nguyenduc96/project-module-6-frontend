import {Component, OnInit} from '@angular/core';
import {Status} from '../../model/status';
import {StatusService} from '../../service/status.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-show-status',
  templateUrl: './show-status.component.html',
  styleUrls: ['./show-status.component.css']
})
export class ShowStatusComponent implements OnInit {
  status: Status[] = [];

  constructor(private statusService: StatusService) {
  }

  ngOnInit() {

  }

  // private getAll() {
  //   this.statusService.getAll().subscribe(status => {
  //     this.status = status;
  //   });
  // }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.status, event.previousIndex, event.currentIndex);
  }
}
