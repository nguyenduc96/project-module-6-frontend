import {Board} from './board';
import {User} from './user';
import {Permission} from './permission';

export interface BoardPermission {
  id?: number;
  board?: Board;
  user?: User;
  permission?: Permission;
}
