import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../service/project/project.service';
import {Project} from '../../model/project';
import {SendProjectService} from '../../SendProjectService';
import {ListProjectService} from '../../ListProjectSerice';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  projects: Project[] = [];

  myProjects: Project[] = [];

  project: Project = {};


  constructor(private projectService: ProjectService,
              private sendProjectService: SendProjectService,
              private listProjectService: ListProjectService) {
    this.getAllProjects();
    this.getProjects();
    this.sendProjectService.currentProject.subscribe(
      project => {
        for (let i = 0; i < this.myProjects.length; i++) {
         if (this.myProjects[i].id === project.id) {
           this.myProjects[i] = project;
           return;
         }
        }
        this.myProjects.push(project);
      }
    );

    this.listProjectService.currentProject.subscribe(
      projects => {
        this.myProjects = projects;
      }
    );
  }

  ngOnInit() {

  }

  getProjects() {
    this.projectService.getProjectByProjectOwner().subscribe(
      data => {
        console.table(data)
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
