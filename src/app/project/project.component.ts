import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Project} from '../model/project';
import {ProjectService} from '../service/project/project.service';
import {showToastSuccess} from '../note';
import {SendProjectService} from '../SendProjectService';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  project: Project = {};


  constructor(private projectService: ProjectService,
              private sendProject: SendProjectService) { }

  ngOnInit() {
  }

  createProject(formCreateProject: NgForm) {
    this.project = formCreateProject.value;
    this.projectService.create(this.project).subscribe(
      (response) => {
        let title = 'Thêm dự án thành công'
        this.project = response;
        this.sendProject.sendProject(this.project);
        showToastSuccess(title);
      },
      (error) => {
        console.log(error);
      });
  }
}
