import { CreateColumnDto } from './create-column-dto';

export class CreateBoardDto {
  board: string;
  columns: CreateColumnDto[];
}
