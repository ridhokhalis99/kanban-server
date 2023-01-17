import { Body, Controller, Put } from '@nestjs/common';
import { ColumnService } from './column.service';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Put()
  updateColumn(@Body() updateColumnDto: any) {
    return this.columnService.updateColumn(updateColumnDto);
  }
}
