import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Test {
  message: string;

  private behaviorSubject = new BehaviorSubject<string>(this.message);

  currentMessage = this.behaviorSubject.asObservable();

  constructor() {
  }

  setMessage(message: string) {
    this.message = message;
    this.behaviorSubject.next(this.message);
  }

}
