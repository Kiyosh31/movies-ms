import { Controller } from '@nestjs/common';
import { CardsService } from './cards.service';

import {
  CardsServiceController,
  CardsServiceControllerMethods,
  CreateCardRequest,
  DeleteCardRequest,
  GetCardRequest,
  UpdateCardRequest,
} from '@app/common';

@Controller('cards')
@CardsServiceControllerMethods()
export class CardsController implements CardsServiceController {
  constructor(private readonly cardsService: CardsService) {}

  createCard(request: CreateCardRequest) {
    return this.cardsService.createCard(request);
  }

  getCard(request: GetCardRequest) {
    return this.cardsService.getCard(request.id);
  }

  updateCard(request: UpdateCardRequest) {
    return this.cardsService.updateCard(request, request.id);
  }

  deleteCard(request: DeleteCardRequest) {
    return this.cardsService.deleteCard(request.id);
  }
}
