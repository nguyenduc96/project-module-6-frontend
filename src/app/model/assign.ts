import {User} from './user';
import {Task} from './task';

export interface Assign {
  id?: number;
  user?: User;
  task?: Task;
}
