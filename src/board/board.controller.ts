import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board-dto';
import { UpdateBoardPayloadDto } from './dto/update-board-payload-dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  @Get()
  getBoards(@Body() { user_id }: { user_id: number }) {
    return this.boardService.getBoards(user_id);
  }

  @Get(':id')
  getBoardById(
    @Param('id') id: string,
    @Body() { user_id }: { user_id: number },
  ) {
    return this.boardService.getBoardById(+id, user_id);
  }

  @Delete(':id')
  deleteBoardById(@Param('id') id: string) {
    return this.boardService.deleteBoardById(+id);
  }

  @Post()
  createBoard(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.createBoard(createBoardDto);
  }

  @Put(':id')
  updateBoardById(
    @Param('id') id: string,
    @Body() updateBoardPayloadDto: UpdateBoardPayloadDto,
  ) {
    return this.boardService.updateBoardById(id, updateBoardPayloadDto);
  }
}
