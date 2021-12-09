import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {BoardPermission} from "../model/board-permission";
const API_URL = `${environment.apiUrl}/permission`;
@Injectable({
  providedIn: 'root'
})
export class BoardPermissionService {

  constructor(private http: HttpClient) { }

  getMyPermission(userId: number, boardId: number): Observable<BoardPermission> {
    return this.http.get<BoardPermission>(API_URL + `/user/${userId}/board/${boardId}`)
  }
}
