import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, column } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board-dto';
import { UpdateBoardPayloadDto } from './dto/update-board-payload-dto';

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
        columns: {
          include: {
            tasks: {
              include: {
                sub_tasks: true,
              },
            },
          },
        },
      },
      where: { id: +id },
    });
  }
  async deleteBoardById(id: string) {
    return await prisma.board.delete({
      where: { id: +id },
    });
  }
  async updateBoardById(
    id: string,
    updateBoardPayloadDto: UpdateBoardPayloadDto,
  ) {
    const { board, columns } = updateBoardPayloadDto;

    const updateBoard = async () => {
      try {
        if (id)
          return await prisma.board.update({
            data: {
              name: board,
            },
            where: {
              id: +id,
            },
          });
      } catch (err) {
        throw err;
      }
    };

    const deleteColumns = async () => {
      try {
        const columnsIds = columns.map(({ id: columnId }: column) => columnId);
        const filteredColumnsIds = columnsIds.filter(
          (columnId: number) => columnId,
        );
        if (id)
          return await prisma.column.deleteMany({
            where: {
              id: {
                notIn: filteredColumnsIds,
              },
              board_id: +id,
            },
          });
      } catch (err) {
        throw err;
      }
    };

    const upsertColumns = async () => {
      return columns.forEach(async ({ name, id: columnId }: column) => {
        try {
          if (columnId)
            return await prisma.column.update({
              where: {
                id: +columnId,
              },
              data: {
                name,
              },
            });

          if (id)
            return await prisma.column.create({
              data: {
                name,
                board: {
                  connect: {
                    id: +id,
                  },
                },
              },
            });
        } catch (err) {
          throw err;
        }
      });
    };

    if (id) {
      try {
        await prisma.$transaction(async () => {
          await updateBoard();
          await deleteColumns();
          await upsertColumns();
        });
        return { message: 'Board updated successfully' };
      } catch (err) {
        console.log(err);
      }
    }
  }
}
