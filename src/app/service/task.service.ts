import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Task} from '../model/task';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

const API_URL = `${environment.apiUrl}/tasks`;

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) {
  }

  sortTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(API_URL + `/${id}`, task);
  }

  addNew(task: Task): Observable<Task> {
    return this.http.post<Task>(API_URL, task);
  }
}
