import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import {
  Card,
  DeleteCardResponse,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from '@app/common';
import { CardsRepository } from './repository/cards.repository';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { CardDocument } from './models/card.schema';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService implements OnModuleInit {
  @Inject(USERS_SERVICE_NAME) private readonly usersClient: ClientGrpc;
  private usersService: UsersServiceClient;

  constructor(private readonly cardRepository: CardsRepository) {}

  onModuleInit() {
    this.usersService =
      this.usersClient.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  private async cardExists(number: number) {
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

  // Your correctly implemented userExists function:
  private async userExists(id: string): Promise<void> {
    try {
      await this.usersService.getUser({ id }).toPromise();
    } catch (error) {
      if (error instanceof RpcException && error.code === status.NOT_FOUND) {
        throw error;
      } else {
        throw new RpcException({
          code: status.UNAVAILABLE, // Or another appropriate error code
          message: 'Failed to check user existence',
        });
      }
    }
  }

  async createCard(CreateCardDto: CreateCardDto): Promise<Card> {
    try {
      await this.userExists(CreateCardDto.userId);
      await this.cardExists(CreateCardDto.number);

      const createdCard = await this.cardRepository.create(CreateCardDto);

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

  async updateCard(updateCardDto: UpdateCardDto, _id: string): Promise<Card> {
    try {
      const updatedCard = await this.cardRepository.findOneAndUpdate(
        { _id },
        { $set: updateCardDto },
      );

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
      await this.cardRepository.findOneAndDelete({ _id });

      return {};
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }

      throw this.handleDatabaseError(err);
    }
  }
}
