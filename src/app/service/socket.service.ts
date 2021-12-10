import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {BoardService} from "./board/board.service";
import {BehaviorSubject} from "rxjs";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {API_URL} from "../url-constant";
import {NotificationService} from "./notification.service";
import {CommentService} from "./comment.service";
const SOCKET_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  stompClient: any;
  stompClientNoti: any;
  stompClientComment:  any;
  board = new BehaviorSubject ({});
  notification = new BehaviorSubject([]);
  comment = new BehaviorSubject([]);

  constructor(private boardService: BoardService,
              private notificationService: NotificationService,
              private commentService: CommentService) {
  }

  // Fix cung title search
  getCurrentBoard(id: number, title?: string) {
    this.boardService.getBoardById(id, title).subscribe( data => {
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

  sendTask(id: number, board: any ) {
    this.stompClient.send( `/app/task/board/${id}`, {} , JSON.stringify(board))
  }

  // connect to notification
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

  sendOneNotification(notification: any) {
    this.stompClientNoti.send(`/app/notification/one`, {} , JSON.stringify(notification))
  }

  getCurrentNotification(id: number) {
    this.notificationService.getAllNoti(id).subscribe(data => {
      this.notification.next(data);
    })
  }


  // connect to comment
  connectToComment(id: number) {
    let socket = new SockJS(API_URL + '/n3');
    this.stompClientComment = Stomp.over(socket);
    this.stompClientComment.connect({}, frame => {
      this.stompClientComment.subscribe(`/topic/comment/task/${id}`, (data) => {
        this.comment.next(JSON.parse(data.body));
      });
    })
  }

  sendComment(id: number, comment: any) {
    this.stompClientComment.send(`/app/comment/task/${id}`, {} , JSON.stringify(comment));
  }

  getCurrentComment(id: number) {
    this.commentService.findById(id).subscribe(data => {
      this.comment.next(data);
    })
  }

}
