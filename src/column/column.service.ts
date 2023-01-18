import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ColumnDetail } from './interfaces/column-detail';

const prisma = new PrismaClient();

@Injectable()
export class ColumnService {
  async updateColumn(columns: ColumnDetail[]) {
    try {
      columns.forEach(({ tasks, id: column_id }: ColumnDetail) => {
        tasks.forEach(async (task: any) => {
          const { order } = task;
          await prisma.task.update({
            where: { id: task.id },
            data: { column_id, order },
          });
        });
      });
      return { message: 'Column updated successfully' };
    } catch (error) {
      console.log(error);
    }
  }
}
