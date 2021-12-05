import { Component, OnInit } from '@angular/core';
import {BoardService} from '../../service/board/board.service';
import {Board} from '../../model/board';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  board: Board[] = [];


  constructor(private boardService: BoardService) { }

  ngOnInit() {
    this.getAll();
  }

  private getAll() {
    this.boardService.getAll().subscribe(board => {
      this.board = board;
    });
  }


}
