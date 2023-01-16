import { Body, Controller, Patch } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { UpdateIsFinishedDto } from './dto/update-is-finished-dto';

@Controller('subtask')
export class SubtaskController {
  constructor(private readonly subtaskService: SubtaskService) {}

  @Patch()
  updateSubtask(@Body() updateIsFinishedDto: UpdateIsFinishedDto) {
    return this.subtaskService.updateIsFinished(updateIsFinishedDto);
  }
}
