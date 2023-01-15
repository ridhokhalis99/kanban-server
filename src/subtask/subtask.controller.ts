import { Controller, Get } from '@nestjs/common';

@Controller('subtask')
export class SubtaskController {
  @Get()
  findAll(): string {
    return 'This action returns all subtasks';
  }
}
