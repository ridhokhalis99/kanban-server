import { Body, Controller, Put } from '@nestjs/common';
import { ColumnService } from './column.service';
import { UpdateColumnDto } from './dto/update-column-dto';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Put()
  updateColumn(@Body() updateColumnDto: UpdateColumnDto) {
    return this.columnService.updateColumn(updateColumnDto);
  }
}
