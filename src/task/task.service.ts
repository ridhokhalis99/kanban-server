import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskColumnDto } from './dto/update-task-column-dto';
import { UpdateTaskPayloadDto } from './dto/update-task-payload-dto';
import { sub_task } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TaskService {
  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description, subtasks, columnId } = createTaskDto;
    const isIncludeSubtasks = !!subtasks?.length;
    let task: Prisma.taskCreateInput;

    if (isIncludeSubtasks) {
      task = {
        name: title,
        description,
        sub_tasks: {
          createMany: {
            data: subtasks,
          },
        },
        column: {
          connect: {
            id: +columnId,
          },
        },
      };
    } else {
      task = {
        name: title,
        description,
        column: { connect: { id: +columnId } },
      };
    }

    try {
      await prisma.task.create({
        data: task,
      });
      return { message: 'Task created successfully' };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async updateTaskColumn(updateTaskColumnDto: UpdateTaskColumnDto) {
    const { taskId, columnId } = updateTaskColumnDto;
    try {
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
      console.log(error);
      return error;
    }
  }
  async deleteTaskById(id: string) {
    try {
      await prisma.task.delete({
        where: {
          id: +id,
        },
      });
      return { message: 'Task deleted successfully' };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async updateTaskById(id: string, updateTaskPayloadDto: UpdateTaskPayloadDto) {
    const { title, description, subtasks, columnId } = updateTaskPayloadDto;

    const updateTask = async () => {
      try {
        if (id)
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
      } catch (err) {
        throw err;
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
            },
          });
      } catch (err) {
        throw err;
      }
    };

    const upsertSubtasks = async () => {
      try {
        return subtasks.forEach(async ({ name, id: subTaskId }: sub_task) => {
          if (subTaskId)
            return await prisma.sub_task.update({
              where: {
                id: +subTaskId,
              },
              data: {
                name,
              },
            });

          if (id)
            return await prisma.sub_task.create({
              data: {
                name,
                task: {
                  connect: {
                    id: +id,
                  },
                },
              },
            });
        });
      } catch (err) {
        throw err;
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
      } catch (err) {
        console.log(err);
      }
    }
  }
}
