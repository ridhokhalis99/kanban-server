import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateIsFinishedDto } from './dto/update-is-finished-dto';

const prisma = new PrismaClient();

@Injectable()
export class SubtaskService {
  async updateIsFinished(updateIsFinishedDto: UpdateIsFinishedDto) {
    const { is_finished, id } = updateIsFinishedDto;
    try {
      await prisma.sub_task.update({
        where: {
          id: +id,
        },
        data: {
          is_finished,
        },
      });
      return { message: 'Subtask updated successfully' };
    } catch (error) {
      console.log(error);
    }
  }
}
