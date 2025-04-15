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
import { CreateCardRequest, UpdateCardRequest } from '@app/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OwnershipGuard } from '../../guards/ownership.guard';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  createCard(@Body() createCardDto: CreateCardRequest) {
    return this.cardsService.createCard(createCardDto);
  }

  @Get(':id')
  // @UseGuards(OwnershipGuard)
  getCard(@Param('id') id: string) {
    return this.cardsService.getCard(id);
  }

  @Patch(':id')
  // @UseGuards(OwnershipGuard)
  updateCard(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardRequest,
  ) {
    updateCardDto.id = id;
    return this.cardsService.updateCard(updateCardDto);
  }

  @Delete(':id')
  // @UseGuards(OwnershipGuard)
  deleteCard(@Param('id') id: string) {
    return this.cardsService.deleteCard(id);
  }
}
