import {Status} from './status';

export interface Board {
  id?: number;
  title?: string;
  project?: number;
  statuses?: Status[];
}
