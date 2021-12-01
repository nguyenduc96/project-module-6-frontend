import {Board} from './board';

export interface Status {
  id?: number;
  title?: string;
  position?: string;
  board?: {
    id: number;
  };
}
