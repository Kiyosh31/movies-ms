import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { catchError, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { UpdateCardRequest } from '@app/common';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  createCard(@Body() createCardDto: CreateCardDto) {
    return this.cardsService
      .createCard(createCardDto)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Get(':id')
  getCard(@Param('id') id: string) {
    return this.cardsService
      .getCard(id)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Patch(':id')
  updateCard(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    const updateCardRequest: UpdateCardRequest = {
      ...updateCardDto,
      id,
    };

    return this.cardsService
      .updateCard(updateCardRequest)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Delete(':id')
  deleteCard(@Param('id') id: string) {
    return this.cardsService
      .deleteCard(id)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }
}
