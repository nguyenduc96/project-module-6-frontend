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
  board = new BehaviorSubject ({});
  notification = new BehaviorSubject([]);

  constructor(private boardService: BoardService,
              private notiServier: NotificationService) {
  }

  getCurrentBoard(id: number) {
    this.boardService.getBoardById(id).subscribe( data => {
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

  sendTask(id: number, board: Board ) {
    this.stompClient.send(`/task/board/${id}`,{}, JSON.stringify(board))
  }

  connectToNotificationBoard(id: number) {
    let socket = new SockJS(API_URL + '/n3');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, frame => {
      this.stompClient.subscribe(`/topic/notification/board/${id}`, (data) => {
        this.notification.next(JSON.parse(data.body));
        console.log('da lay duoc notimoi')
      });
    })
  }

  sendNotification(id: number, notification: any) {
    this.stompClient.send(`/app/notification/board/${id}`,{}, JSON.stringify(notification))
  }

  getCurrentNotification(id: number) {
    this.notiServier.getAllNoti(id).subscribe(data => {
      console.log(data);
      this.notification.next(data);
    })
  }
}
