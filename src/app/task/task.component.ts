import {Component, OnInit} from '@angular/core';
import {Board} from '../model/board';
import {FormControl, FormGroup} from '@angular/forms';
import {BoardService} from '../service/board.service';
import {TaskService} from '../service/task.service';
import {StatusService} from '../service/status.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Status} from '../model/status';
import Swal from 'sweetalert2';
import {Task} from '../model/task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  board: Board;
  newTask: FormGroup = new FormGroup({
    title: new FormControl(),
    position: new FormControl(),
    status: new FormControl(),
  });
  statusId: number;
  isShowAddBox: boolean = false;

  constructor(private boardService: BoardService,
              private taskService: TaskService,
              private statusService: StatusService) {
    this.getBoard();
  }

  ngOnInit() {
  }

  dropTask(event: CdkDragDrop<Task[], any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log(event.container.data);
      this.moveInArray(event);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.moveToOtherArray(event);
    }
  }

  private getBoard() {
    this.boardService.getBoardById(1).subscribe(data => {
      this.board = data;
      console.log(this.board);
    }, error => {
      console.log('Error');
    });
  }



  dropStatus(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.board.statuses, event.previousIndex, event.currentIndex);
    console.log(this.board.id);
    console.log(this.board.statuses);
    for (let i = 0; i < this.board.statuses.length; i++) {
      const status = this.board.statuses[i];
      status.position = i;
      status.board.id = this.board.id;
      this.moveStatus(status.id, status);
    }
  }


  private moveToOtherArray(event: CdkDragDrop<Task[], any>) {
    for (let i = 0; i < event.container.data.length; i++) {
      const task = event.container.data[i];
      task.position = i;
      console.log(+event.container.id);
      task.status.id = +event.container.id;
      this.taskService.sortTask(event.container.data[i].id, task).subscribe(data => {
        console.log(data);
      });
    }
    for (let i = 0; i < event.previousContainer.data.length; i++) {
      const task = event.previousContainer.data[i];
      task.position = i;
      console.log(task);
      this.taskService.sortTask(event.previousContainer.data[i].id, task).subscribe(data => {
        console.log(data);
      });
    }
  }

  private moveInArray(event: CdkDragDrop<Task[], any>) {
    for (let i = 0; i < event.container.data.length; i++) {
      const task = event.container.data[i];
      task.position = i;
      this.moveTask(event, i, task);
    }
  }

  private moveTask(event: CdkDragDrop<Task[], any>, i: number, task: Task) {
    this.taskService.sortTask(event.container.data[i].id, task).subscribe(data => {
      console.log(data);
    });
  }

  private moveStatus(id: number, status: Status) {
    this.statusService.moveStatus(id, status).subscribe(data => {
      console.log(data.position);
    });
  }

  listConnectTo(): string[] {
    return this.board.statuses.map(status => status.id.toString());
  }

  addNewTask() {
    this.newTask.get('status').setValue({id: this.statusId});
    this.taskService.addNew(this.newTask.value).subscribe(data => {
      console.log(data);
      this.getBoard();
    });
    this.successAlert();
  }

  setStatusId(id: number) {
    this.statusId = id;
    this.showAddBox();
  }

  showAddBox() {
    this.isShowAddBox = !this.isShowAddBox;
  }

  successAlert() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: 'success',
      title: 'Signed in successfully'
    });
  }

}
