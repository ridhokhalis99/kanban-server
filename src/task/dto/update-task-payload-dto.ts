import { sub_task } from '@prisma/client';

export class UpdateTaskPayloadDto {
  description: string;
  subtasks: sub_task[];
  title: string;
  columnId: string;
  user_id: number;
}
