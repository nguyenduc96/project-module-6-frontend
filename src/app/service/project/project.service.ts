import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_URL, PROJECTS} from '../../url-constant';
import {Project} from '../../model/project';
import {User} from '../../model/user';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(`${API_URL}/${PROJECTS}`);
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${API_URL}/${PROJECTS}/get-by-user`);
  }

  create(project: Project): Observable<Project> {
    return this.http.post<Project>(`${API_URL}/${PROJECTS}`, project);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${API_URL}/${PROJECTS}/${id}`);
  }

  getProjectByProjectOwner(): Observable<Project[]> {
    return this.http.get<Project[]>(`${API_URL}/${PROJECTS}/get-by-project-owner`);
  }

  addMember(projectId: number, user: User): Observable<Project> {
    return this.http.put<Project>(`${API_URL}/${PROJECTS}/${projectId}/add-user`, user);
  };

  removeProject(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/${PROJECTS}/${id}`);
  }

  updateProject(id:number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${API_URL}/${PROJECTS}/${id}`, project);
  }

  getUserByProjectId(id : number): Observable<User[]> {
    return this.http.get<User[]>(API_URL + `/project/${id}/get_user`);
  }
}
