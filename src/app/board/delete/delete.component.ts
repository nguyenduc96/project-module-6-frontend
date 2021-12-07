import {Component, OnInit} from '@angular/core';
import {Board} from '../../model/board';
import {BoardService} from '../../service/board/board.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  board: Board = {};
  id: number;

  constructor(private boardService: BoardService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.id = +paramMap.get('id');
      let title = '';
      this.boardService.getBoardById(this.id, title).subscribe(board => {
        this.board = board;
      });
    });
  }


  ngOnInit() {
  }

  delete() {
    this.boardService.delete(this.id).subscribe(() => {
      this.router.navigateByUrl('/boards');
    });
  }

  list() {
    this.router.navigateByUrl('/boards');
  }
}
