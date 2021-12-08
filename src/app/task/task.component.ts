import {Component, OnInit} from '@angular/core';
import {Board} from '../model/board';
import {FormControl, FormGroup} from '@angular/forms';

import {TaskService} from '../service/task.service';
import {StatusService} from '../service/status.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Status} from '../model/status';
import Swal from 'sweetalert2';
import {Task} from '../model/task';
import {successAlert} from '../note';
import {LabelService} from '../service/label.service';
import {ColorService} from '../service/color.service';
import {Label} from '../model/label';
import {Color} from '../model/color';
import {ActivatedRoute} from '@angular/router';
import {BoardService} from '../service/board/board.service';
import {SocketService} from "../service/socket.service";
import {Notification} from "../model/notification";

declare var $: any;

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  board: Board;
  labels: Label[];
  colors: Color[];
  notification: Notification[];
  newTask: FormGroup =  new FormGroup({
    title: new FormControl(),
    position: new FormControl(),
    status:  new FormControl(),
  });
  newStatus: FormGroup = new FormGroup({
    title: new FormControl(),
    position: new FormControl(),
    board: new FormControl(),
  });
  newLabel: FormGroup = new FormGroup({
    id: new FormControl(),
    content: new FormControl(),
    color: new FormControl(),
    board: new FormControl(),
  });
  taskDetail: Task = {};
  statusId: number;
  statusEditId: number;
  isShowTaskAddBox: boolean = false;
  isShowTitleInput: boolean = false;
  isShowDescriptionInput: boolean = false;
  isShowDeadlineInput: boolean = false;
  isShowAddStatusBox: boolean = false;
  constructor(private boardService: BoardService,
              private taskService: TaskService,
              private statusService: StatusService,
              private labelService: LabelService,
              private colorService: ColorService,
              private activatedRoute: ActivatedRoute,
              private socketService: SocketService) {


  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(param => {
      const id = +param.get('id');
      this.getBoard(id);
    });
    this.colorService.getAll().subscribe(data => {this.colors = data; });
  }

  private getBoard(id: number) {
    this.socketService.getCurrentNotification(id);
    this.socketService.getCurrentBoard(id);
    this.socketService.connectToBoardSocket(id);
    this.socketService.connectToNotificationBoard(id);
    this.socketService.notification.subscribe(data => {
      this.notification = data;
    })
    this.socketService.board.subscribe(data => {
      this.board = data;
    })
  }

  private getLabels() {
    this.labelService.getAllLabelByBoardId(this.board.id).subscribe(labels => {
      this.labels = labels;
    });
  }

  // Chức năng kéo thả
  dropTask(event: CdkDragDrop<Task[], any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
       this.moveInArray(event);
       if(event.previousIndex != event.currentIndex) {
         this.addNoti("Đã di chuyển 1 thẻ ở bảng " +  this.board.title)
         this.socketService.sendTask(this.board.id, this.board);
       }
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

  dropStatus(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.board.statuses, event.previousIndex, event.currentIndex);
    if(event.previousIndex != event.currentIndex) {
      for (let i = 0; i < this.board.statuses.length; i++) {
        this.board.statuses[i].position =  i;
        console.log(this.board.statuses[i].title + ' ' + this.board.statuses[i].position);
      }
      this.addNoti("Đã di chuyển 1 cột ở bảng " +  this.board.title)
        this.socketService.sendTask(this.board.id, this.board)
    }
  }

  private moveToOtherArray(event: CdkDragDrop<Task[], any>) {
    for (let i = 0; i < event.container.data.length; i++) {
      event.container.data[i].position = i;
      event.container.data[i].status.id = +event.container.id;
    }
    for (let i = 0; i < event.previousContainer.data.length; i++) {
      event.previousContainer.data[i].position = i;
    }
    for (let i = 0; i < this.board.statuses.length; i++) {
      console.log(this.board.statuses[i].title + ' ' + this.board.statuses[i].position);
    }
    this.addNoti("Đã di chuyển 1 thẻ ở bảng " +  this.board.title)
    this.socketService.sendTask(this.board.id, this.board);
  }

  // private sendTo() {
  //   this.socketService.sendBoard(this.board.id)
  // }

  private moveInArray(event: CdkDragDrop<Task[], any>) {
    for (let i = 0; i < event.container.data.length; i++) {
     event.container.data[i].position = i;
    }

  }

  // private moveTask(event: CdkDragDrop<Task[], any>, i: number, task: Task) {
  //   this.taskService.sortTask(event.container.data[i].id, task).subscribe();
  // }
  //
  // private moveStatus(id: number, status: Status) {
  //   this.statusService.editStatus(id, status).subscribe(data => {
  //   });
  //
  // }

  // Lấy danh sách các list connect nhau
  listConnectTo(): string[] {
    return this.board.statuses.map(status => status.id.toString());
  }

  // Task function
  addNewTask(i: number) {
    this.newTask.get('status').setValue({id: this.statusId});
    this.newTask.get('position').setValue(this.board.statuses[i].tasks.length);
    this.taskService.addNew(this.newTask.value).subscribe(data => {console.log(data); this.getBoard(this.board.id); });
    this.newTask = new FormGroup({
      title: new FormControl(),
      position: new FormControl(99999),
      status:  new FormControl(),
    });
    this.getBoard(this.board.id);
    this.addNoti("Đã thêm 1 thẻ mới ở bảng " +  this.board.title);
    successAlert();
  }

  showTaskAddBox() {
    this.isShowTaskAddBox = !this.isShowTaskAddBox;
  }

  showTaskDetail(id: number) {
    this.taskService.findById(id).subscribe(data => {this.taskDetail = data; }, error => { console.log('khong lay duoc detail'); });
  }

  editTaskDetail() {
    this.taskService.editTask(this.taskDetail.id, this.taskDetail).subscribe(data => {console.log(data); this.getBoard(this.board.id);; });
  }

  showDescriptionEdit() {
    this.isShowDescriptionInput = !this.isShowDescriptionInput;
  }

  showDeadlineEdit() {
    this.isShowDeadlineInput = !this.isShowDeadlineInput;
  }

  deleteTask() {
    this.taskService.deleteTask(this.taskDetail.id).subscribe(() => this.getBoard(this.board.id))
    this.taskDetail = {};
  }


  // Status function
  showTitleEdit() {
    this.isShowTitleInput = !this.isShowTitleInput;
  }

  setStatusId(id: number) {
    this.statusId  = id;
    this.showTaskAddBox();
  }

  showAddStatusForm() {
    this.isShowAddStatusBox = !this.isShowAddStatusBox;
  }

  addNewStatus() {
    this.newStatus.get('board').setValue({id: this.board.id});
    this.newStatus.get('position').setValue(this.board.statuses.length);
    this.statusService.addNewStatus(this.newStatus.value).subscribe(data => {console.log(data);this.getBoard(this.board.id); });
    this.newStatus = new FormGroup({
      title: new FormControl(),
      position: new FormControl(this.board.statuses.length),
      board: new FormControl(),
    });
    this.getBoard(this.board.id);
    successAlert();
  }

  showEditTitleStatus(id: number) {
    this.statusEditId = id;
  }

  isShowEditTitle(id: number) {
    return this.statusEditId !== id;
  }

  saveEditStatus(i: number) {
    const newTitle = $(`#titleStatus${this.statusEditId}`).val();
    const status = {
      id: this.board.statuses[i].id,
      title: newTitle,
      position: this.board.statuses[i].position,
      board: {
        id: this.board.id,
      }
    };
    this.statusService.editStatus(status.id, status).subscribe(data => {console.log(data); this.getBoard(this.board.id); this.statusEditId = -1; });
  }

  deleteStatus(id: number) {
    this.statusService.deleteStatus(id).subscribe(() => this.getBoard(this.board.id) );
  }

  // Label function

  addNewLabel() {
    this.newLabel.get('board').setValue({id : this.board.id});
    this.newLabel.get('color').setValue({id : this.newLabel.get('color').value});
    this.labelService.addNewLabel(this.newLabel.value).subscribe(data => {
      successAlert();
      this.getLabels();
      this.newLabel = new FormGroup({
        id: new FormControl(),
        content: new FormControl(),
        color: new FormControl(),
        board: new FormControl(),
      });
    });
  }

  showLabelDetail(id: number) {
    this.labelService.getById(id).subscribe( data => {
      this.newLabel = new FormGroup({
        id: new FormControl(data.id),
        content: new FormControl(data.content),
        color: new FormControl(data.color.id),
        board: new FormControl({id: this.board.id}),
      });
    });
  }

  editLabel() {
    this.newLabel.get('board').setValue({id : this.board.id});
    this.newLabel.get('color').setValue({id : this.newLabel.get('color').value});
    this.labelService.addNewLabel(this.newLabel.value).subscribe(data => {
      this.getLabels();
      this.newLabel = new FormGroup({
        id: new FormControl(),
        content: new FormControl(),
        color: new FormControl(),
        board: new FormControl(),
      });
    });
  }

  deleteLabel() {
    this.labelService.deleteLabel(this.newLabel.get('id').value).subscribe(() => {
      this.getLabels();
      successAlert();
    });
  }

  // Notification function
  addNoti(value: string) {
    let user = JSON.parse(localStorage.getItem('user'))
    let noti = {
      sender: {id: user.id},
      action: value,
    };
    this.socketService.sendNotification(this.board.id, noti );
  }


}
