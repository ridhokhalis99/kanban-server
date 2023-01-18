import {
  Body,
  Controller,
  Patch,
  Post,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskService } from './task.service';
import { UpdateTaskColumnDto } from './dto/update-task-column-dto';
import { UpdateTaskPayloadDto } from './dto/update-task-payload-dto';

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

  @Delete(':id')
  deleteTaskById(
    @Param('id') id: string,
    @Body() { user_id }: { user_id: number },
  ) {
    return this.taskService.deleteTaskById(+id, user_id);
  }

  @Put(':id')
  updateTaskById(
    @Param('id') id: string,
    @Body() updateTaskPayloadDto: UpdateTaskPayloadDto,
  ) {
    return this.taskService.updateTaskById(id, updateTaskPayloadDto);
  }
}
