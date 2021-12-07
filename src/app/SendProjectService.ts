import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Project} from './model/project';


@Injectable({
  providedIn: 'root'
})
export class SendProjectService {
  project: Project;

  private projectBS = new BehaviorSubject(this.project);

  currentProject = this.projectBS.asObservable();

  constructor() {
  }

  sendProject(project: Project) {
    this.projectBS.next(project);
  }
}
