import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_URL, PROJECTS} from '../../url-constant';
import {Project} from '../../model/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) {
  }

  // getAll(): Observable<Project[]> {
  //   return this.http.get<Project[]>(`${API_URL}/${PROJECTS}`);
  // }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${API_URL}/${PROJECTS}`);
  }

  create(project: Project): Observable<Project> {
    return this.http.post<Project>(`${API_URL}/${PROJECTS}`, project);
  }
}
