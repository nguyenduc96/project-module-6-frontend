import {Component, OnInit} from '@angular/core';
import {Project} from '../../model/project';
import {BoardService} from '../../service/board/board.service';
import {ProjectService} from '../../service/project/project.service';
import {Router} from '@angular/router';
import {Board} from '../../model/board';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  projects: Project[] = [];

  constructor(private boardService: BoardService,
              private projectService: ProjectService,
              private router: Router) {
  }

  ngOnInit() {
    this.getAllProjects();
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe(data => {
      this.projects = data;
    }, error => console.log(error));
  }

  submit(boardForm) {
    let board = boardForm.value;
    board.project = {
      id: board.project
    },
      this.boardService.create(board).subscribe(() => {
        boardForm.resetForm();
        this.router.navigateByUrl('/boards');
      }, error => {
      });
  }
}
