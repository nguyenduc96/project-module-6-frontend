import {Status} from './status';

export interface Board {
  project?: any;
  id?: number;
  title?: string;
  statuses?: Status[];
}
