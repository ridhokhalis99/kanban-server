import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board-dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  @Get()
  getBoards() {
    return this.boardService.getBoards();
  }

  @Get(':id')
  getBoardById(@Param('id') id: string) {
    return this.boardService.getBoardById(id);
  }

  @Post()
  createBoard(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.createBoard(createBoardDto);
  }

  @Delete(':id')
  deleteBoardById(@Param('id') id: string) {
    return this.boardService.deleteBoardById(id);
  }
}
