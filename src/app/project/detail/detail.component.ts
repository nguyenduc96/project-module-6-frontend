import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../service/project/project.service';
import {ActivatedRoute} from '@angular/router';
import {Project} from '../../model/project';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {User} from '../../model/user';
import {showPopupError, showToastError, showToastSuccess, successAlert} from '../../note';
import {BoardService} from "../../service/board/board.service";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  project: Project = {};

  user: User = {};

  newBoard: FormGroup = new FormGroup({
    id: new FormControl(),
    title: new FormControl(),
    project: new FormControl(),
  });

  constructor(private projectService: ProjectService,
              private activatedRouter: ActivatedRoute,
              private boardService: BoardService) {
    this.getProject();
  }

  ngOnInit() {

  }

  getProject() {
    this.activatedRouter.paramMap.subscribe(params => {
      let id = +params.get('id');
      this.projectService.getProject(id).subscribe(project => {
        this.project = project;
      });
    });
  }

  addUser(formAddUser: NgForm) {
    this.user = formAddUser.value;
    this.projectService.addMember(this.project.id, this.user).subscribe(() => {
      showToastSuccess('Thêm thành công');
    }, error => {
      showPopupError('Thêm thất bại', 'Tên thành viên không đúng hoặc bạn không có quyền thêm thành viên');
    });
  }

  saveBoard() {
    this.newBoard.get('project').setValue({ id: this.project.id});
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
    this.boardService.getBoardById(id).subscribe(data => {
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
}
