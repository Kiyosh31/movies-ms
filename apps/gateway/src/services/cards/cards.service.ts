import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CARDS_SERVICE_NAME,
  CardsServiceClient,
  CreateCardRequest,
  UpdateCardRequest,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class CardsService implements OnModuleInit {
  private cardsService: CardsServiceClient;
  private usersService: UsersServiceClient;

  constructor(
    @Inject(CARDS_SERVICE_NAME) private cardsClient: ClientGrpc,
    @Inject(USERS_SERVICE_NAME) private usersClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.cardsService =
      this.cardsClient.getService<CardsServiceClient>(CARDS_SERVICE_NAME);

    this.usersService =
      this.usersClient.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  async createCard(createCardDto: CreateCardRequest, jwtUserId: string) {
    const user = await this.usersService
      .getUser({ id: createCardDto.userId })
      .toPromise();
    if (user?.id !== jwtUserId) {
      throw new UnauthorizedException(
        'You dont have permission to access this resource',
      );
    }

    return this.cardsService.createCard(createCardDto);
  }

  async getCard(cardId: string, jwtUserId: string) {
    const card = await this.cardsService.getCard({ id: cardId }).toPromise();
    if (card?.userId !== jwtUserId) {
      throw new UnauthorizedException(
        'You dont have permission to access this resource',
      );
    }

    return card;
  }

  async updateCard(updateCardRequest: UpdateCardRequest, jwtUserId: string) {
    const card = await this.cardsService
      .getCard({ id: updateCardRequest.id })
      .toPromise();
    if (card?.userId !== jwtUserId) {
      throw new UnauthorizedException(
        'You dont have permission to access this resource',
      );
    }

    return this.cardsService.updateCard(updateCardRequest);
  }

  async deleteCard(cardId: string, jwtUserId: string) {
    const card = await this.cardsService.getCard({ id: cardId }).toPromise();
    if (card?.userId !== jwtUserId) {
      throw new UnauthorizedException(
        'You dont have permission to access this resource',
      );
    }

    return this.cardsService.deleteCard({ id: cardId });
  }
}
