import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {User} from '../model/user';
import {Assign} from '../model/assign';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AssignService {

  constructor(private http: HttpClient) { }

  getAllUsersInAssignByTaskId(id: number): Observable<User[]> {
    return this.http.get<User[]>(API_URL + '/assign/' + id + '/get-members');
  }

  addMemberToAssign(assign: Assign): Observable<Assign> {
    return this.http.post<Assign>(API_URL + '/assign/add-member', assign);
  }
}
