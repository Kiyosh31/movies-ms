import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { catchError, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { UpdateCardRequest } from '@app/common';
import { Request } from 'express';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async createCard(@Body() createCardDto: CreateCardDto, @Req() req: Request) {
    try {
      return await this.cardsService.createCard(createCardDto, req['user'].id);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @Get(':id')
  async getCard(@Param('id') id: string, @Req() req: Request) {
    try {
      return await this.cardsService.getCard(id, req['user'].id);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @Patch(':id')
  async updateCard(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
    @Req() req: Request,
  ) {
    const updateCardRequest: UpdateCardRequest = {
      ...updateCardDto,
      id,
    };

    try {
      return await this.cardsService.updateCard(
        updateCardRequest,
        req['user'].id,
      );
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @Delete(':id')
  async deleteCard(@Param('id') id: string, @Req() req: Request) {
    try {
      return await this.cardsService.deleteCard(id, req['user'].id);
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
