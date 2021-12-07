import {Status} from './status';

export interface Board {
  id?: number;
  title?: string;
  statuses?: Status[];
}
