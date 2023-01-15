import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board-dto';

const prisma = new PrismaClient();

@Injectable()
export class BoardService {
  async getBoards() {
    return await prisma.board.findMany();
  }
  async createBoard(createBoardDto: CreateBoardDto) {
    const { board: boardTitle, columns } = createBoardDto;
    const isIncludeColumns = !!columns?.length;
    let board: Prisma.boardCreateInput;

    if (isIncludeColumns) {
      board = {
        name: boardTitle,
        columns: {
          createMany: {
            data: columns,
          },
        },
      };
    } else {
      board = { name: boardTitle };
    }

    try {
      await prisma.board.create({
        data: board,
      });
      return { message: 'Board created successfully' };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getBoardById(id: string) {
    return await prisma.board.findUnique({
      include: {
        columns: true,
      },
      where: { id: +id },
    });
  }
  async deleteBoardById(id: string) {
    return await prisma.board.delete({
      where: { id: +id },
    });
  }
}
