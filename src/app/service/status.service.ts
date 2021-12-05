import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Status} from '../model/status';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private http: HttpClient) {
  }

  // getAll() {
  //   return this.http.get<Status[]>(API_URL + '/status');
  // }

  // saveStatus(status: Status): Observable<Status> {
  //   return this.http.post<Status>(API_URL + 'status', status);
  // }

  findById(id: number): Observable<Status> {
    return this.http.get<Status>(`${API_URL}/status/${id}`);
  }

  // moveStatus(id: number, status: Status): Observable<Status> {
  //   return this.http.put<Status>(`${API_URL}/status/${id}`, status);
  // }

  deleteStatus(id: number): Observable<Status> {
    return this.http.get<Status>(`${API_URL}/status/${id}`);
  }

  editStatus(id: number, status: Status): Observable<Status> {
    return this.http.put<Status>(`${API_URL}/status/${id}`, status);
  }

  addNewStatus(status: Status): Observable<Status> {
    return this.http.post(`${API_URL}/status`, status);
  }


}
