import { Injectable } from '@nestjs/common';
import { PrismaClient, column } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board-dto';
import { UpdateBoardPayloadDto } from './dto/update-board-payload-dto';
import { HttpException } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export class BoardService {
  async getBoards(user_id: number) {
    return await prisma.board.findMany({ where: { user_id: user_id } });
  }
  async createBoard(createBoardDto: CreateBoardDto) {
    const { board: boardTitle, columns, user_id } = createBoardDto;
    const isIncludeColumns = !!columns?.length;
    try {
      const createdBoard = await prisma.board.create({
        data: {
          name: boardTitle,
          user: {
            connect: {
              id: user_id,
            },
          },
        },
      });
      if (isIncludeColumns) {
        columns.forEach(async (column) => {
          const { name, order } = column;
          await prisma.column.create({
            data: {
              name: name,
              order: order,
              board: {
                connect: {
                  id: createdBoard.id,
                },
              },
              user: {
                connect: {
                  id: user_id,
                },
              },
            },
          });
        });
      }

      return { message: 'Board created successfully', data: createdBoard };
    } catch (error) {
      console.log(error);
      throw new HttpException('Internal server error', 500);
    }
  }
  async getBoardById(id: number, user_id: number) {
    try {
      return await prisma.board.findFirstOrThrow({
        where: {
          id: id,
          user_id: user_id,
        },
        include: {
          columns: {
            orderBy: {
              order: 'asc',
            },
            include: {
              tasks: {
                orderBy: {
                  order: 'asc',
                },
                include: {
                  sub_tasks: {
                    orderBy: {
                      order: 'asc',
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Board not found', 404);
      }
      console.log(error);
      throw new HttpException('Internal server error', 500);
    }
  }
  async deleteBoardById(id: number, user_id: number) {
    try {
      await prisma.board.findFirstOrThrow({
        where: { id: id, user_id: user_id },
      });
      await prisma.board.delete({
        where: { id: +id },
      });
      return { message: 'Board deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Board not found', 404);
      }
      console.log(error);
      throw new HttpException('Internal server error', 500);
    }
  }
  async updateBoardById(
    id: string,
    updateBoardPayloadDto: UpdateBoardPayloadDto,
  ) {
    const { columns, user_id, board: boardName } = updateBoardPayloadDto;

    const updateBoard = async () => {
      try {
        if (id) {
          await prisma.board.findFirstOrThrow({
            where: {
              id: +id,
              user_id: user_id,
            },
          });
          return await prisma.board.update({
            data: {
              name: boardName,
            },
            where: {
              id: +id,
            },
          });
        }
      } catch (error) {
        throw error;
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
              user_id: user_id,
            },
          });
      } catch (error) {
        throw error;
      }
    };

    const upsertColumns = async () => {
      return columns.forEach(async ({ name, id: columnId, order }: column) => {
        try {
          if (columnId) {
            await prisma.column.findFirstOrThrow({
              where: {
                id: +columnId,
                user_id: user_id,
              },
            });
            return await prisma.column.update({
              where: {
                id: +columnId,
              },
              data: {
                name,
                order,
              },
            });
          }

          if (id)
            return await prisma.column.create({
              data: {
                name,
                order,
                board: {
                  connect: {
                    id: +id,
                  },
                },
                user: {
                  connect: {
                    id: user_id,
                  },
                },
              },
            });
        } catch (error) {
          throw error;
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
        //anticipate delay for prisma to update
        await new Promise((resolve) => setTimeout(resolve, 500));
        const updatedBoard = await this.getBoardById(+id, user_id);
        return { message: 'Board updated successfully', data: updatedBoard };
      } catch (error) {
        if (error.code === 'P2025') {
          throw new HttpException('Board not found', 404);
        }
        console.log(error);
        throw new HttpException('Internal server error', 500);
      }
    }
  }
}
