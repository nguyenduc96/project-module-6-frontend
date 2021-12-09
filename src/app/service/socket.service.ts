import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {BoardService} from "./board/board.service";
import {BehaviorSubject} from "rxjs";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {API_URL} from "../url-constant";
import {Task} from "../model/task";
import {Board} from "../model/board";
import {NotificationService} from "./notification.service";
const SOCKET_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  stompClient: any;
  stompClientNoti: any;
  board = new BehaviorSubject ({});
  notification = new BehaviorSubject([]);

  constructor(private boardService: BoardService,
              private notificationService: NotificationService) {
  }

  // Fix cung title search
  getCurrentBoard(id: number) {
    this.boardService.getBoardById(id, "").subscribe( data => {
        this.board.next(data);
    })
  }

  connectToBoardSocket(id: number) {
      let socket = new SockJS(API_URL + '/n3');
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({}, frame => {
        this.stompClient.subscribe(`/topic/task/board/${id}`, (data) => {
            this.board.next(JSON.parse(data.body));
        }, );
      })
  }

  // sendBoard(id: number) {
  //   this.stompClient.send(`/app/board/${id}` , {}, )
  // }

  sendTask(id: number, board: any ) {
    this.stompClient.send( `/app/task/board/${id}`, {} , JSON.stringify(board))
  }

  connectToNotificationByUserId(id: number) {
    let socket = new SockJS(API_URL + '/n3');
    this.stompClientNoti = Stomp.over(socket);
    this.stompClientNoti.connect({}, frame => {
      this.stompClientNoti.subscribe(`/topic/notification/board/user/${id}`, (data) => {
        this.notification.next(JSON.parse(data.body));
      });
    })
  }

  sendNotification(id: number, notification: any) {
    this.stompClientNoti.send(`/app/notification/board/${id}`,{}, JSON.stringify(notification))
  }

  getCurrentNotification(id: number) {
    this.notificationService.getAllNoti(id).subscribe(data => {
      this.notification.next(data);
    })
  }
}
