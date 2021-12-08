import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_URL, BOARD} from '../../url-constant';
import {Board} from '../../model/board';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) {
  }
  getAll(): Observable<Board[]> {
    return this.http.get<Board[]>(`${API_URL}/${BOARD}`);
  }

  create(board: Board): Observable<Board[]> {
    return this.http.post<Board[]>(`${API_URL}/${BOARD}`, board);
  }
  edit(id: number, board: Board): Observable<Board> {
    return this.http.put<Board>(`${API_URL}/${BOARD}/${id}`, board);
  }

  delete(id: number): Observable<Board> {
    return this.http.delete(`${API_URL}/${BOARD}/${id}`);
  }

  getBoardById(id: number, title?: string): Observable<Board> {
    return this.http.get<Board>(`${API_URL}/${BOARD}/${id}?title=${title}`);
  }
}
