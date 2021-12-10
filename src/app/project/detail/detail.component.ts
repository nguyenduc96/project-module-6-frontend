import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../service/project/project.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Project} from '../../model/project';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {User} from '../../model/user';
import {showPopupError, showToastError, showToastSuccess} from '../../note';
import {ListProjectService} from '../../ListProjectSerice';
import {SendProjectService} from '../../SendProjectService';
import {BoardService} from '../../service/board/board.service';
import {UserService} from '../../service/user.service';
import {SocketService} from "../../service/socket.service";

declare var $: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  project: Project = {};

  user: User = {};

  projectId: number;

  emails = [];

  emailInProjects = new Set();

  searchText;

  newBoard: FormGroup = new FormGroup({
    id: new FormControl(),
    title: new FormControl(),
    project: new FormControl(),
  });

  email: string;

  isInputEmail: boolean = false;

  constructor(private projectService: ProjectService,
              private boardService: BoardService,
              private activatedRouter: ActivatedRoute,
              private router: Router,
              private listProjectService: ListProjectService,
              private sendProject: SendProjectService,
              private userService: UserService,
              private socketService: SocketService) {
    this.getProject();
    this.getUserInProject();
    this.getAllEmail();
  }

  ngOnInit() {

  }

  getAllEmail() {
    this.userService.getAllEmail().subscribe(data => {
      this.emails = data;
    });
  }

  getUserInProject() {
    this.projectService.getUserByProjectId(this.projectId).subscribe(data => {
      for (let user of data) {
        this.emailInProjects.add(user.email);
      }
    });
  }

  getProject() {
    this.activatedRouter.paramMap.subscribe(params => {
      this.projectId = +params.get('id');
      this.projectService.getProject(this.projectId).subscribe(project => {
        this.project = project;
      });
    });
  }

  addUser(formAddUser: NgForm) {
    let email = $('#email').val();
    this.user = {
      email: email
    };
    this.projectService.addMember(this.project.id, this.user).subscribe((data) => {
      showToastSuccess('Thêm thành công');
      for (let u of data.users) {this.emailInProjects.add(u.email);}
    }, error => {
      if (error.status === 409) {
        showPopupError('Thêm thất bại', 'Thành viên đã có trong dự án');
      } else if (error.status === 304) {
        showPopupError('Thêm thất bại', 'Bạn không có quyền thêm thành viên');
      } else {
        showPopupError('Thêm thất bại', 'Email thành viên không đúng');
      }
    });
    this.addNotiOne("Đã thêm bạn vào dự án " + this.project.title, email)
    formAddUser.reset();

  }

  deleteProject() {
    this.projectService.removeProject(this.project.id).subscribe((data) => {
      this.listProjectService.addProjects(data);
      this.router.navigateByUrl('/home');
      showToastSuccess('Xóa thành công');
    }, error => {
      showPopupError('Xóa thất bại', 'Bạn không có quyền xóa dự án này');
    });
  }

  editProject(formEdit: NgForm) {
    let type = $('#type').val();
    this.project = formEdit.value;
    this.project.type = type;
    this.projectService.updateProject(this.projectId, this.project).subscribe((data) => {
      this.sendProject.sendProject(data);
      formEdit.reset();
      this.router.navigateByUrl('/home');
      showToastSuccess('Sửa thành công');
    }, error => {
      if (error.status === 304) {
        showPopupError('Sửa thất bại', 'Bạn không có quyền sửa dự án này');
        this.router.navigateByUrl('/home');
        formEdit.reset();

      }
    });
  }

  saveBoard() {
    this.newBoard.get('project').setValue({id: this.project.id});
    this.boardService.create(this.newBoard.value).subscribe(() => {
      this.getProject();
      showToastSuccess('Success!');
      this.newBoard = new FormGroup({
        id: new FormControl(),
        title: new FormControl(),
        project: new FormControl(),
      });
    });

  }

  showBoardDetail(id: number) {
    let title = '';
    this.boardService.getBoardById(id, title).subscribe(data => {
      this.newBoard = new FormGroup({
        id: new FormControl(data.id),
        title: new FormControl(data.title),
        project: new FormControl({id: this.project.id}),
      });
    });
  }


  deleteBoard() {
    this.boardService.delete(this.newBoard.get('id').value).subscribe(() => {
      this.getProject();
      showToastSuccess('Delete Board!');
    });
  }

  inputEmail(email: any) {
    $('#email').val(email);
  }

  checkEmail(email: string) {
    return this.emailInProjects.has(email);
  }

  searchEmail() {
    let email = $('#email').val();
    this.isInputEmail = !(email === '' || email === null || email === undefined);
  }

  // Notification
  addNotiOne(value: String, email: string ) {
    let user = JSON.parse(localStorage.getItem('user'));
    let noti = {
      sender: {id: user.id},
      action: value,
      receiver: {
        email : email
      },
      link: `/projects/${this.projectId}`,
    };
    this.socketService.sendOneNotification(noti);
  }
}
