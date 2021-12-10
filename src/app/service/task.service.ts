  import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Task} from '../model/task';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
  import {Label} from '../model/label';

const API_URL = `${environment.apiUrl}/tasks`;

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) {
  }

  getAll(statusId: number, title: string): Observable<Task[]> {
    return this.http.get<Task[]>(API_URL + `/${statusId}?title=${title}`);
  }

  sortTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(API_URL + `/${id}`, task);
  }

  addNew(task: Task): Observable<Task> {
    return this.http.post<Task>(API_URL, task);
  }

  findById(id: number): Observable<Task> {
    return this.http.get<Task>(API_URL + `/${id}`);
  }

  editTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(API_URL + `/${id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(API_URL + `/${id}`);
  }

  getLabelByTaskId(id: number): Observable<Label[]> {
    return this.http.get<Label[]>(API_URL + `/${id}/get-label`);
  }
}
