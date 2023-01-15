import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardController } from './board/board.controller';
import { TaskController } from './task/task.controller';
import { SubtaskController } from './subtask/subtask.controller';
import { BoardService } from './board/board.service';

@Module({
  imports: [],
  controllers: [AppController, BoardController, TaskController, SubtaskController],
  providers: [AppService, BoardService],
})
export class AppModule {}
