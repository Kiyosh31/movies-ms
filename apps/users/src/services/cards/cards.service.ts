import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import {
  Card,
  CreateCardRequest,
  DeleteCardResponse,
  EVENT_CREATE_NOTIFICATION,
  NOTIFICATIONS_QUEUE,
  UpdateCardRequest,
} from '@app/common';
import { CardsRepository } from './repository/cards.repository';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { CardDocument } from './models/card.schema';
import { CreateNotificationDto } from '@app/common';

@Injectable()
export class CardsService implements OnModuleInit {
  constructor(
    private readonly cardRepository: CardsRepository,
    @Inject(NOTIFICATIONS_QUEUE) private rabbitMqClient: ClientProxy,
  ) {}

  onModuleInit() {}

  private async cardExists(number: string) {
    try {
      await this.cardRepository.findOne({ number });
    } catch {
      return;
    }

    throw new RpcException({
      code: status.ALREADY_EXISTS,
      message: 'Card already exists',
    });
  }

  mapCardDocumentToDto(card: CardDocument): Card {
    return {
      id: card._id.toString(),
      cardName: card.cardName,
      cardType: card.cardType,
      number: card.number,
      expMonth: card.expMonth,
      expYear: card.expYear,
      type: card.type,
      cvc: card.cvc,
      userId: card.userId,
    };
  }

  private handleDatabaseError(error: any): RpcException {
    return new RpcException({
      code: status.INTERNAL,
      message: error.message || 'Database error occurred',
    });
  }

  async createCard(createCardRequest: CreateCardRequest): Promise<Card> {
    try {
      await this.cardExists(createCardRequest.number);

      const createdCard = await this.cardRepository.create(createCardRequest);

      const rabbitMqPayload: CreateNotificationDto = {
        userId: createdCard.userId,
        message: 'Card created',
        data: this.mapCardDocumentToDto(createdCard),
      };
      this.rabbitMqClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);

      return this.mapCardDocumentToDto(createdCard);
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }

      throw this.handleDatabaseError(err);
    }
  }

  async getCard(_id: string): Promise<Card> {
    try {
      const foundCard = await this.cardRepository.findOne({ _id });
      if (!foundCard) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Card not found',
        });
      }

      return this.mapCardDocumentToDto(foundCard);
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }

      throw this.handleDatabaseError(err);
    }
  }

  async updateCard(updateCardRequest: UpdateCardRequest): Promise<Card> {
    try {
      const updatedCard = await this.cardRepository.findOneAndUpdate(
        { _id: updateCardRequest.id },
        { $set: updateCardRequest },
      );

      const rabbitMqPayload: CreateNotificationDto = {
        userId: updatedCard.userId,
        message: 'Card updated',
        data: this.mapCardDocumentToDto(updatedCard),
      };
      this.rabbitMqClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);

      return this.mapCardDocumentToDto(updatedCard);
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }

      throw this.handleDatabaseError(err);
    }
  }

  async deleteCard(_id: string): Promise<DeleteCardResponse> {
    try {
      const deletedCard = await this.cardRepository.findOneAndDelete({ _id });

      const rabbitMqPayload: CreateNotificationDto = {
        userId: deletedCard.userId,
        message: 'Card deleted',
        data: null,
      };
      this.rabbitMqClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);

      return {};
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }

      throw this.handleDatabaseError(err);
    }
  }
}
