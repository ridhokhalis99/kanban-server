import { ColumnDetail } from '../interfaces/column-detail';

export class UpdateColumnDto {
  user_id: number;
  columns: ColumnDetail[];
}
