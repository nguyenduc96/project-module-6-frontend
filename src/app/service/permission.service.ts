import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Permission} from '../model/permission';
import {BoardPermission} from '../model/board-permission';

const URL = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) { }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${URL}/permission/get-all`);
  }

  removeBoardPermission(userId: number, boardId: number): Observable<any> {
    return this.http.delete<any>(`${URL}/permission/${userId}/${boardId}`);
  }

  addBoardPermission(boardPermission: BoardPermission): Observable<BoardPermission> {
    return this.http.post<BoardPermission>(`${URL}/permission/add-board-permission`, boardPermission);
  }
}
