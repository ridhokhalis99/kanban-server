import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateIsFinishedDto } from './dto/update-is-finished-dto';
import { HttpException } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export class SubtaskService {
  async updateIsFinished(updateIsFinishedDto: UpdateIsFinishedDto) {
    const { is_finished, id, user_id } = updateIsFinishedDto;
    try {
      await prisma.sub_task.findFirstOrThrow({
        where: {
          id: +id,
          user_id,
        },
      });
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
      if (error.code === 'P2025') {
        throw new HttpException('Subtask not found', 404);
      }
      console.log(error);
      throw new HttpException('Internal server error', 500);
    }
  }
}
