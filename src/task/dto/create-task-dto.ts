import { sub_task } from '@prisma/client';

export class CreateTaskDto {
  title: string;
  description: string;
  subtasks: sub_task[];
  columnId: number;
}
