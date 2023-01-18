import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TokenValidateMiddleware } from './middleware/token-validate.middleware';

@Module({
  imports: [],
  controllers: [
    AppController,
    BoardController,
    TaskController,
    SubtaskController,
    ColumnController,
    UserController,
  ],
  providers: [
    AppService,
    BoardService,
    TaskService,
    SubtaskService,
    ColumnService,
    UserService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenValidateMiddleware)
      .forRoutes(
        BoardController,
        TaskController,
        SubtaskController,
        ColumnController,
      );
  }
}
