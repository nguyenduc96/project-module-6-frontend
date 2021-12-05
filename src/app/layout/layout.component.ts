import { Component, OnInit } from '@angular/core';
import {Project} from '../model/project';
import {ProjectService} from '../service/project/project.service';
import {SendProjectService} from '../SendProjectService';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  projects: Project[] = [];

  myProjects: Project[] = [];

  project: Project = {};

  constructor(private projectService: ProjectService) {
    this.getAllProjects();
    this.getMyProjects();

  }

  ngOnInit() {
  }

  getMyProjects() {
    this.projectService.getProjectByProjectOwner().subscribe(
      data => {
        this.myProjects = data;
      },
      error => {
        console.log(error);
      }
    );
  }


  getAllProjects() {
    this.projectService.getAllProjects().subscribe(
      data => {
        this.projects = data;
      },
      error => {
        console.log(error);
      }
    );
  }


}
