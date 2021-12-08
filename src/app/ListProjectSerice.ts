import {Injectable} from '@angular/core';
import {Project} from './model/project';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListProjectService {
  projects: Project[] = [];

  private projectBS = new BehaviorSubject<Project[]>(this.projects);

  currentProject = this.projectBS.asObservable();

  constructor() {
  }

  addProjects(projects: Project[]) {
    this.projectBS.next(projects);
  }
}
