import {Component, OnInit} from '@angular/core';
import {Board} from '../model/board';
import {FormControl, FormGroup, NgForm} from '@angular/forms';

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
import {CommentService} from '../service/comment.service';
import {UserService} from '../service/user.service';
import {Comment} from '../model/comment';
import {ProjectService} from '../service/project/project.service';
import {User} from '../model/user';
import {PermissionService} from '../service/permission.service';
import {Permission} from '../model/permission';

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
  comments: any[];

  comment: Comment = {};

  newComment: FormGroup = new FormGroup({
    content: new FormControl(),
  });
  newTask: FormGroup = new FormGroup({
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

  boardId: number;


  projectId: number;

  isInputEmail: boolean = false;

  email: string;

  emails = new Set();

  emailsConvert: any[] = [];

  emailInBoard = new Set();

  permissions: Permission[] = [];

  constructor(private boardService: BoardService,
              private taskService: TaskService,
              private statusService: StatusService,
              private labelService: LabelService,
              private colorService: ColorService,
              private projectService: ProjectService,
              private commentService: CommentService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private permissionService: PermissionService) {
    this.activatedRoute.paramMap.subscribe(param => {
      const id = +param.get('id');
      this.boardId = id;
      this.getBoard(id);
    });
    this.colorService.getAll().subscribe(data => {
      this.colors = data;
    });
  }

  getAllPermissions() {
    this.permissionService.getPermissions().subscribe(data => {
      this.permissions = data;
    })
  }

  addUserToBoard(formAddUser: NgForm) {

  }

  searchEmail() {
    let email = $('#email').val();
    this.isInputEmail = !(email === '' || email === null || email === undefined);
  }

  checkEmail(email: string) {
    return this.emailInBoard.has(email);
  }

  getUserInBoard() {
    this.boardService.getAllUserInBoard(this.boardId).subscribe(data => {
      data.forEach(user => {
        this.emailInBoard.add(user.email);
      });
    });
  }

  getBoard(id: number) {
    let title = $('#title-search-task').val();
    if (title === undefined) {
      title = '';
    }
    this.boardService.getBoardById(id, title).subscribe(data => {
      this.board = data;
      this.projectId = this.board.project;
      this.getUserByProject(this.projectId);
      this.getLabels();
    }, error => {
      console.log('Error');
    });
  }

  getUserByProject(id) {
    this.projectService.getUserByProjectId(id).subscribe(data => {
      for (let user of data) {
        this.emails.add(user.email);
      }
      this.emailsConvert.push(...this.emails);
    });
  }

  private getLabels() {
    this.labelService.getAllLabelByBoardId(this.board.id).subscribe(labels => {
      this.labels = labels;
    });
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

  dropStatus(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.board.statuses, event.previousIndex, event.currentIndex);
    console.log(this.board.id);
    console.log(this.board.statuses);
    for (let i = 0; i < this.board.statuses.length; i++) {
      const statusMove = {
        id: this.board.statuses[i].id,
        title: this.board.statuses[i].title,
        position: i,
        board: {
          id: this.board.id,
        }
      };
      this.moveStatus(statusMove.id, statusMove);
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
    this.statusService.editStatus(id, status).subscribe(data => {
      console.log(data.position);
    });
  }

  listConnectTo(): string[] {
    return this.board.statuses.map(status => status.id.toString());
  }

  //add comment


  addNewComment(formComment: NgForm) {
    // this.newComment.get('task').setValue({id: this.taskId});
    // this.commentService.addComment(this.newComment.value).subscribe( data => {this.showTaskDetail(this.taskDetail.id)})
    // this.newComment = new FormGroup({
    //   content: new FormControl(),
    // });
    this.comment = formComment.value;
    this.comment.task = {
      id: this.taskDetail.id
    };
    this.commentService.addComment(this.comment).subscribe(data => {
      this.showTaskDetail(this.taskDetail.id);
      successAlert();
    });
  }

  addNewTask(i: number) {
    this.newTask.get('status').setValue({id: this.statusId});
    this.newTask.get('position').setValue(this.board.statuses[i].tasks.length);
    this.taskService.addNew(this.newTask.value).subscribe(data => {
      console.log(data);
      this.getBoard(this.board.id);
    });
    this.newTask = new FormGroup({
      title: new FormControl(),
      position: new FormControl(99999),
      status: new FormControl(),
    });
    this.getBoard(this.board.id);
    successAlert();
  }

  setStatusId(id: number) {
    this.statusId = id;
    this.showTaskAddBox();
  }

  showTaskAddBox() {
    this.isShowTaskAddBox = !this.isShowTaskAddBox;
  }

  showCommentByTaskId(id: number) {
    this.commentService.findById(id).subscribe(data => {
      this.comments = data;
    });
  }


  showTaskDetail(id: number) {
    this.taskService.findById(id).subscribe(data => {
      this.taskDetail = data;
      this.showCommentByTaskId(id);
    }, error => {
      console.log('khong lay duoc detail');
    });
  }

  showTitleEdit() {
    this.isShowTitleInput = !this.isShowTitleInput;
  }

  showDescriptionEdit() {
    this.isShowDescriptionInput = !this.isShowDescriptionInput;
  }

  showDeadlineEdit() {
    this.isShowDeadlineInput = !this.isShowDeadlineInput;
  }

  showAddStatusForm() {
    this.isShowAddStatusBox = !this.isShowAddStatusBox;
  }

  editTaskDetail(id: number) {
    this.taskService.editTask(this.taskDetail.id, this.taskDetail).subscribe(data => {
      console.log(data);
      this.getBoard(this.board.id);
    });
  }

  addNewStatus() {
    this.newStatus.get('board').setValue({id: this.board.id});
    this.newStatus.get('position').setValue(this.board.statuses.length);
    this.statusService.addNewStatus(this.newStatus.value).subscribe(data => {
      console.log(data);
      this.getBoard(this.board.id);
    });
    this.newStatus = new FormGroup({
      title: new FormControl(),
      position: new FormControl(this.board.statuses.length),
      board: new FormControl(),
    });
    this.getBoard(this.board.id);
    successAlert();
  }

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

  deleteTask(id: number) {
    this.taskService.deleteTask(this.taskDetail.id).subscribe(() => this.getBoard(this.board.id));
    this.taskDetail = {};
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
      console.log(data);
      this.getBoard(this.board.id);
      this.statusEditId = -1;
    });
  }

  deleteStatus(id: number) {
    this.statusService.deleteStatus(id).subscribe(() => this.getBoard(this.board.id));
  }

  ngOnInit(): void {
  }

  inputEmail(email: string) {
    $('#email').val(email);
  }
}
