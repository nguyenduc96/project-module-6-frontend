import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {TaskFile} from '../model/taskFile';
const API_URL = `${environment.apiUrl}/task-files`;




@Injectable({
  providedIn: 'root'
})
export class TaskFileService {

  constructor(private http: HttpClient) { }

  getAllByTaskId(id: number): Observable<TaskFile[]> {
    return this.http.get<TaskFile[]>(API_URL+ `/task/${id}`)
  }

  addTaskFile(taskFile: TaskFile): Observable<TaskFile> {
    return this.http.post<TaskFile>(API_URL, taskFile);
  }

  deleteFile(id: number): Observable<any>{
    return this.http.delete<any>(API_URL + `/${id}`);
  }



}
