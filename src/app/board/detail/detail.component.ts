import { Component, OnInit } from '@angular/core';
import {Board} from '../../model/board';
import {FormControl, FormGroup} from '@angular/forms';
import {BoardService} from '../../service/board/board.service';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  id: number;
  board: Board = {};
  boardForm: FormGroup = new FormGroup({
    id: new FormControl(),
    title: new FormControl(),
  });
  constructor(private boardService: BoardService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = +paramMap.get('id');
      this.getBoardDetail(this.id);
    });
  }

  ngOnInit() {
  }

  getBoardDetail(id) {
    let title = '';
    return this.boardService.getBoardById(id, title).subscribe(book => {
      this.board = book;
      this.boardForm = new FormGroup({
        id: new FormControl(book.id),
        title: new FormControl(book.title),
      });
    });
  }


}
