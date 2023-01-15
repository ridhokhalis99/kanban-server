import { Body, Controller, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskService } from './task.service';
import { UpdateTaskColumnDto } from './dto/update-task-column-dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Patch()
  updateTaskColumn(@Body() updateTaskColumnDto: UpdateTaskColumnDto) {
    return this.taskService.updateTaskColumn(updateTaskColumnDto);
  }
}
