import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Board} from '../../model/board';
import {Project} from '../../model/project';
import {BoardService} from '../../service/board/board.service';
import {ProjectService} from '../../service/project/project.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  editBoardForm: FormGroup = new FormGroup({
    id: new FormControl('0'),
    title: new FormControl('', Validators.required),
    project: new FormControl()
  });
  board: Board = {};
  id: number;
  projects: Project[] = [];


  constructor(private boardService: BoardService,
              private projectService: ProjectService,
              private activatedRoute: ActivatedRoute,
              private router: Router
  ) {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.id = +paramMap.get('id');
      let title = '';
      this.boardService.getBoardById(this.id, title).subscribe(board => {
        this.board = board;
        this.editBoardForm = new FormGroup({
          id: new FormControl(this.board.id),
          title: new FormControl(this.board.title, Validators.required),
          // project: new FormControl(this.board.project.id),
        });
      });

    });
  }


  ngOnInit() {
    this.getAllProjects();
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe(data => {
      this.projects = data;
    }, error => console.log(error));
  }

  get title() {
    return this.editBoardForm.get('title');
  }

  submit(editBoardForm) {
    let board = editBoardForm.value;
    board.project = {
      id: board.project
    };
    this.boardService.edit(this.id, board).subscribe((data) => {
      this.board = data;
      this.router.navigate(['/boards']);
    }, error => {
      alert('Lỗi :(((');
    });
  }

  // editBoard() {
  //   let board = this.editBoardForm.value;
  //   board.project = {
  //     id: board.project
  //   },
  //   this.boardService.edit(this.id, board).subscribe();
  // }
}
