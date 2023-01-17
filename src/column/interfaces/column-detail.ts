import { column } from '@prisma/client';
import { Prisma } from '@prisma/client';

export interface ColumnDetail extends column {
  tasks: Prisma.taskGetPayload<{
    include: {
      sub_tasks: true;
    };
  }>[];
}
