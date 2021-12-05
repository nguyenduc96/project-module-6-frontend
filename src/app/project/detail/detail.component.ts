import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../service/project/project.service';
import {ActivatedRoute} from '@angular/router';
import {Project} from '../../model/project';
import {NgForm} from '@angular/forms';
import {User} from '../../model/user';
import {showPopupError, showToastError, showToastSuccess} from '../../note';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  project: Project = {};

  user: User = {};

  constructor(private projectService: ProjectService,
              private activatedRouter: ActivatedRoute) {
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
}
