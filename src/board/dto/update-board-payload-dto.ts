import { column } from '@prisma/client';

export class UpdateBoardPayloadDto {
  board: string;
  columns?: column[];
  user_id: number;
}
