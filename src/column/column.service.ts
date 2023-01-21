import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateColumnDto } from './dto/update-column-dto';
import { ColumnDetail } from './interfaces/column-detail';
import { task } from '@prisma/client';
import { HttpException } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export class ColumnService {
  async updateColumn(updateColumnDto: UpdateColumnDto) {
    const { columns, user_id } = updateColumnDto;
    try {
      columns.forEach(({ tasks, id: column_id }: ColumnDetail) => {
        tasks.forEach(async (task: task) => {
          const { id, order } = task;
          await prisma.task.findFirstOrThrow({
            where: { id, user_id },
          });
          await prisma.task.update({
            where: { id: id },
            data: { column_id, order },
          });
        });
      });
      return { message: 'Column updated successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Task not found', 404);
      }
      console.log(error);
    }
  }
}
