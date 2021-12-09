export interface Comment {
  id?: number;
  content?: string;
  date?: string;
  task?: {
    id?: number;
  };
  user?: {
    id?: number;
  };
}
