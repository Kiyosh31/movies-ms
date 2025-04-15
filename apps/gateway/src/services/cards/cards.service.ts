import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CARDS_SERVICE_NAME,
  CardsServiceClient,
  CreateCardRequest,
  UpdateCardRequest,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class CardsService implements OnModuleInit {
  private cardsService: CardsServiceClient;

  constructor(@Inject(CARDS_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.cardsService =
      this.client.getService<CardsServiceClient>(CARDS_SERVICE_NAME);
  }

  createCard(createCardDto: CreateCardRequest) {
    return this.cardsService.createCard(createCardDto);
  }

  getCard(id: string) {
    return this.cardsService.getCard({ id });
  }

  updateCard(updateCardDto: UpdateCardRequest) {
    return this.cardsService.updateCard(updateCardDto);
  }

  deleteCard(id: string) {
    return this.cardsService.deleteCard({ id });
  }
}
