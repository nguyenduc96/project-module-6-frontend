import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {User} from '../model/user';

const URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  registerAccount(formData): Observable<User> {
    return this._http.post<User>(URL + '/user/register', formData);
  }

  setAvatar(avatar): Observable<User> {
    return this._http.post<User>(URL + '/user/set-avatar', avatar);
  }

  getUser(): Observable<User> {
    return this._http.get<User>(URL + '/user/get-user/');
  }

  changePassword(formData): Observable<User> {
    return this._http.post<User>(URL + '/user/set-password', formData);
  }
}
