import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, column } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board-dto';
import { UpdateBoardPayloadDto } from './dto/update-board-payload-dto';

const prisma = new PrismaClient();

@Injectable()
export class BoardService {
  async getBoards(user_id: number) {
    return await prisma.board.findMany({ where: { user_id: user_id } });
  }
  async createBoard(createBoardDto: CreateBoardDto) {
    const { board: boardTitle, columns, user_id } = createBoardDto;
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
        user: {
          connect: {
            id: user_id,
          },
        },
      };
    } else {
      board = {
        name: boardTitle,
        user: {
          connect: {
            id: user_id,
          },
        },
      };
    }

    try {
      const createdBoard = await prisma.board.create({
        data: board,
      });
      return { message: 'Board created successfully', data: createdBoard };
    } catch (error) {
      console.log(error);
      return error;
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
      console.log(error);
      return error;
    }
  }
  async deleteBoardById(id: number) {
    try {
      await prisma.board.delete({
        where: { id: +id },
      });
      return { message: 'Board deleted successfully' };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async updateBoardById(
    id: string,
    updateBoardPayloadDto: UpdateBoardPayloadDto,
  ) {
    const { columns, user_id } = updateBoardPayloadDto;

    const updateBoard = async () => {
      try {
        if (id) {
          const board = await this.getBoardById(+id, user_id);
          if (!board) throw new Error('Board not found');
          return await prisma.board.update({
            data: {
              name: board,
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
        const boards = await prisma.board.findMany({
          where: {
            id: +id,
            user_id: user_id,
          },
        });
        if (!boards.length) throw new Error('Board not found');
        if (id)
          return await prisma.column.deleteMany({
            where: {
              id: {
                notIn: filteredColumnsIds,
              },
              board_id: +id,
            },
          });
      } catch (error) {
        throw error;
      }
    };

    const upsertColumns = async () => {
      return columns.forEach(async ({ name, id: columnId, order }: column) => {
        try {
          if (columnId)
            return await prisma.column.update({
              where: {
                id: +columnId,
              },
              data: {
                name,
                order,
              },
            });

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
        console.log(error);
      }
    }
  }
}
