import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Comment} from '../model/comment';

const API_URL = `${environment.apiUrl}/comments`

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(API_URL, comment);
  }

  findById(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(API_URL + `/task/${id}`);
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete<any>(API_URL + `/${id}`);
  }

}
