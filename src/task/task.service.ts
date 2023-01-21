import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskColumnDto } from './dto/update-task-column-dto';
import { UpdateTaskPayloadDto } from './dto/update-task-payload-dto';
import { sub_task } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TaskService {
  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description, subtasks, columnId, user_id } = createTaskDto;
    const isIncludeSubtasks = !!subtasks?.length;

    try {
      const createdTask = await prisma.task.create({
        data: {
          name: title,
          description,
          column: { connect: { id: +columnId } },
          user: {
            connect: {
              id: +user_id,
            },
          },
        },
      });
      if (isIncludeSubtasks) {
        subtasks.forEach(async (subtask) => {
          const { name, order } = subtask;
          await prisma.sub_task.create({
            data: {
              name: name,
              order: order,
              task: {
                connect: {
                  id: createdTask.id,
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
      return { message: 'Task created successfully' };
    } catch (error) {
      console.log(error);
    }
  }
  async updateTaskColumn(updateTaskColumnDto: UpdateTaskColumnDto) {
    const { taskId, columnId, user_id } = updateTaskColumnDto;
    try {
      await prisma.task.findFirstOrThrow({
        where: {
          id: +taskId,
          user_id: user_id,
        },
      });
      await prisma.task.update({
        where: {
          id: +taskId,
        },
        data: {
          column: {
            connect: {
              id: +columnId,
            },
          },
        },
      });
      return { message: 'Task updated successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        return { message: 'Task not found' };
      }
      console.log(error);
    }
  }
  async deleteTaskById(id: number, user_id: number) {
    try {
      await prisma.task.findFirstOrThrow({
        where: {
          id: +id,
          user_id: user_id,
        },
      });
      await prisma.task.delete({
        where: {
          id: +id,
        },
      });
      return { message: 'Task deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        return { message: 'Task not found' };
      }
      console.log(error);
    }
  }
  async updateTaskById(id: string, updateTaskPayloadDto: UpdateTaskPayloadDto) {
    const { title, description, subtasks, columnId, user_id } =
      updateTaskPayloadDto;

    const updateTask = async () => {
      try {
        if (id)
          await prisma.task.findFirstOrThrow({
            where: {
              id: +id,
              user_id: user_id,
            },
          });
        return await prisma.task.update({
          data: {
            name: title,
            description: description,
            column_id: +columnId,
          },
          where: {
            id: +id,
          },
        });
      } catch (error) {
        throw error;
      }
    };

    const deleteSubtasks = async () => {
      try {
        const subtasksIds = subtasks.map(({ id }: sub_task) => id);
        const filteredSubtasksIds = subtasksIds.filter((id: number) => id);
        if (id)
          return await prisma.sub_task.deleteMany({
            where: {
              id: {
                notIn: filteredSubtasksIds,
              },
              task_id: +id,
              user_id: user_id,
            },
          });
      } catch (error) {
        throw error;
      }
    };

    const upsertSubtasks = async () => {
      try {
        return subtasks.forEach(
          async ({ name, id: subTaskId, order }: sub_task) => {
            if (subTaskId) {
              await prisma.sub_task.findFirstOrThrow({
                where: {
                  id: +subTaskId,
                  user_id: user_id,
                },
              });
              return await prisma.sub_task.update({
                where: {
                  id: +subTaskId,
                },
                data: {
                  name,
                  order,
                },
              });
            }

            if (id)
              return await prisma.sub_task.create({
                data: {
                  name,
                  order,
                  task: {
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
          },
        );
      } catch (error) {
        throw error;
      }
    };

    if (id) {
      try {
        await prisma.$transaction(async () => {
          await updateTask();
          await deleteSubtasks();
          await upsertSubtasks();
        });
        //anticipate delay for prisma to update
        await new Promise((resolve) => setTimeout(resolve, 500));
        const taskDetail = await prisma.task.findUnique({
          where: {
            id: +id,
          },
          include: {
            sub_tasks: true,
          },
        });
        return { message: 'Task updated successfully', data: taskDetail };
      } catch (error) {
        if (error.code === 'P2025') {
          return { message: 'Task not found' };
        }
        console.log(error);
      }
    }
  }
}
