import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskColumnDto } from './dto/update-task-column-dto';

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
}
