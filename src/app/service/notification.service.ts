import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
const API_URL = `${environment.apiUrl}/notifications`;
import {Notification} from "../model/notification";
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getAllNoti(id: number) : Observable<Notification[]>{
    return this.http.get<Notification[]>(API_URL+ `/${id}`);
  }

  markAsReadNoti(id: number): Observable<Notification> {
    return this.http.put<Notification>(API_URL + `/${id}`, {});
  }
}
