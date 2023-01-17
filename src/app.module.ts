import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardController } from './board/board.controller';
import { TaskController } from './task/task.controller';
import { SubtaskController } from './subtask/subtask.controller';
import { BoardService } from './board/board.service';
import { TaskService } from './task/task.service';
import { SubtaskService } from './subtask/subtask.service';
import { ColumnController } from './column/column.controller';
import { ColumnService } from './column/column.service';

@Module({
  imports: [],
  controllers: [AppController, BoardController, TaskController, SubtaskController, ColumnController],
  providers: [AppService, BoardService, TaskService, SubtaskService, ColumnService],
})
export class AppModule {}
