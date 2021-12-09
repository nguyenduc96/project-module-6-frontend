import {Component, OnInit} from '@angular/core';
import {Board} from '../model/board';
import {FormControl, FormGroup, NgForm} from '@angular/forms';

import {TaskService} from '../service/task.service';
import {StatusService} from '../service/status.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Status} from '../model/status';
import Swal from 'sweetalert2';
import {Task} from '../model/task';
import {showToastError, showToastNotice, showToastSuccess, successAlert} from '../note';
import {LabelService} from '../service/label.service';
import {ColorService} from '../service/color.service';
import {Label} from '../model/label';
import {Color} from '../model/color';
import {ActivatedRoute} from '@angular/router';
import {BoardService} from '../service/board/board.service';
import {CommentService} from '../service/comment.service';
import {UserService} from '../service/user.service';
import {Comment} from '../model/comment';
import {TaskFileService} from '../service/task-file.service';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {TaskFile} from '../model/taskFile';
import {log} from 'util';
import {SocketService} from "../service/socket.service";
import {Notification} from "../model/notification";
import {BoardPermission} from "../model/board-permission";
import {BoardPermissionService} from "../service/board-permission.service";

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
  comments: any[];
  taskFiles: any[];
  selectedFile: File = null;
  downloadURL: Observable<string>;

  taskFile: TaskFile = {};

  comment: Comment = {};

  permission: BoardPermission = {}

  newComment: FormGroup = new FormGroup({
    content: new FormControl(),
  });
  newTask: FormGroup =  new FormGroup({
    title: new FormControl(),
    position: new FormControl(),
    status: new FormControl(),
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
  currentUser = JSON.parse(localStorage.getItem('user'));
  taskId: number;
  taskDetail: Task = {};
  statusId: number;
  statusEditId: number;
  isShowTaskAddBox: boolean = false;
  isShowTitleInput: boolean = false;
  isShowDescriptionInput: boolean = false;
  isShowDeadlineInput: boolean = false;
  isShowAddStatusBox: boolean = false;
  isSearchTask: boolean = false;
  isViewer: boolean = false;
  boardId: number;

  constructor(private boardService: BoardService,
              private taskService: TaskService,
              private statusService: StatusService,
              private labelService: LabelService,
              private colorService: ColorService,
              private taskFileService: TaskFileService,
              private commentService: CommentService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private socketService: SocketService,
              private storage: AngularFireStorage,
              private boardPermissionService: BoardPermissionService) {}


  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user'))
    this.activatedRoute.paramMap.subscribe(param => {
      const id = +param.get('id');
      this.boardId = id;
      this.getBoard(id);
      this.boardPermissionService.getMyPermission(user.id,id).subscribe(data => {
        this.permission = data;
        this.isViewer = (this.permission.permission.id == 1);
      })
    });
    this.colorService.getAll().subscribe(data => {
      this.colors = data;
    });

  }

  getBoard(id: number) {
    this.socketService.getCurrentBoard(id, "");
    this.socketService.connectToBoardSocket(id);
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

  private moveInArray(event: CdkDragDrop<Task[], any>) {
    for (let i = 0; i < event.container.data.length; i++) {
     event.container.data[i].position = i;
    }
  }


  // Lấy danh sách các list connect nhau
  listConnectTo(): string[] {
    return this.board.statuses.map(status => status.id.toString());
  }

  // Task function
  //add TaskFile
    addTaskFile(event) {
    let text = 'Đang cập nhật ảnh đại diện'
    showToastNotice(text);
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.taskFile.task = {
                id: this.taskDetail.id
              }
              this.taskFile.name = url;
              this.taskFileService.addTaskFile(this.taskFile). subscribe( data => {
              })
            }
            this.addNoti("Đã thêm file vào thẻ " + this.taskDetail.title.substr(0,10) + "...")
            showToastSuccess("Thêm file thành công!")
          }, () => {
            let title = "Thêm file thất bại";
            showToastError(title)
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }




  //add comment
  addNewComment(formComment: NgForm){
    let user = JSON.parse(localStorage.getItem('user'))
    this.comment = formComment.value;
    this.comment.task = {
      id: this.taskDetail.id
    }
    this.comment.user = {
      id: user.id
    }
    // this.commentService.addComment(this.comment).subscribe(data => {
    //   this.showTaskDetail(this.taskDetail.id)
    // })
    this.socketService.sendComment(this.taskDetail.id, this.comment);
    showToastSuccess("Đã thêm bình luận");
    this.addNoti("Đã thêm bình luận vào thẻ " + this.taskDetail.title.substr(0,10) + "...")
    formComment.reset();
    this.comment = {};
  }

  addNewTask(i: number) {
    this.newTask.get('status').setValue({id: this.statusId});
    this.newTask.get('position').setValue(this.board.statuses[i].tasks.length);
    this.taskService.addNew(this.newTask.value).subscribe(data => {console.log(data); this.getBoard(this.board.id); });
    this.newTask = new FormGroup({
      title: new FormControl(),
      position: new FormControl(99999),
      status: new FormControl(),
    });
    this.socketService.getCurrentBoard(this.board.id, "");
    this.addNoti("Đã thêm 1 thẻ mới ở bảng " +  this.board.title);
    successAlert();
  }

  showTaskAddBox() {
    this.isShowTaskAddBox = !this.isShowTaskAddBox;
  }

  // showCommentByTaskId( id: number){
  //   this.commentService.findById(id).subscribe(data => {this.comments = data});
  // }

  showTaskFileByTaskId(id : number){
    this.taskFileService.getAllByTaskId(id).subscribe( data => {
      this.taskFiles = data;
    })
  }


  // show comment/taskFile By Task

  showTaskDetail(id: number) {
    this.taskService.findById(id).subscribe(data => {
      this.taskDetail = data;
      // this.showCommentByTaskId(id);
      this.showTaskFileByTaskId(id) });
    this.socketService.connectToComment(id);
    this.socketService.getCurrentComment(id);
    this.socketService.comment.subscribe(comment => {
      this.comments = comment;
    })
  }


  editTaskDetail() {
    this.taskService.editTask(this.taskDetail.id, this.taskDetail).subscribe(data => {
      console.log(data);
      this.socketService.getCurrentBoard(this.board.id, "");
      this.addNoti("Đã chỉnh sửa 1 thẻ ở bảng " + this.board.title  )
    });
  }

  showDescriptionEdit() {
    this.isShowDescriptionInput = !this.isShowDescriptionInput;
  }

  showDeadlineEdit() {
    this.isShowDeadlineInput = !this.isShowDeadlineInput;
  }

  deleteTask() {
    this.taskService.deleteTask(this.taskDetail.id).subscribe(() => {
      this.socketService.getCurrentBoard(this.board.id, "");
      this.addNoti("Đã xoá 1 thẻ ở bảng " + this.board.title  )
    })
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
    this.socketService.getCurrentBoard(this.board.id, "");
    this.addNoti("Đã thêm 1 cột ở bảng " + this.board.title  )
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
    this.statusService.editStatus(status.id, status).subscribe(data => {
      this.addNoti("Đã sửa 1 cột ở bảng " + this.board.title)
      this.socketService.getCurrentBoard(this.board.id, "");
      this.statusEditId = -1;
    });
  }

  deleteStatus(id: number) {
    this.statusService.deleteStatus(id).subscribe(() => {
      this.socketService.getCurrentBoard(this.board.id, "");
      this.addNoti("Đã xoá 1 cột ở bảng " + this.board.title)
    });
  }

  // Label function

  addNewLabel() {
    this.newLabel.get('board').setValue({id: this.board.id});
    this.newLabel.get('color').setValue({id: this.newLabel.get('color').value});
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
    this.labelService.getById(id).subscribe(data => {
      this.newLabel = new FormGroup({
        id: new FormControl(data.id),
        content: new FormControl(data.content),
        color: new FormControl(data.color.id),
        board: new FormControl({id: this.board.id}),
      });
    });
  }

  editLabel() {
    this.newLabel.get('board').setValue({id: this.board.id});
    this.newLabel.get('color').setValue({id: this.newLabel.get('color').value});
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
      link: `/tasks/list/${this.board.id}`,
    };
    this.socketService.sendNotification(this.board.id, noti );
  }


  search(boardId: number) {
    let title = $("#title-search-task").val()
    this.socketService.getCurrentBoard(boardId, title);
  }

  deleteComment(id) {
    this.commentService.deleteComment(id).subscribe(() => {
      this.socketService.getCurrentComment(this.taskDetail.id);
      this.socketService.comment.subscribe(comment => {
        this.comments = comment;
      })
    })
  }
}
