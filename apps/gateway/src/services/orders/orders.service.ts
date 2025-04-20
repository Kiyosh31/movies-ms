import {
  CARDS_SERVICE_NAME,
  CardsServiceClient,
  CreateOrderRequest,
  ORDERS_SERVICE_NAME,
  OrdersServiceClient,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from '@app/common';
import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class OrdersService implements OnModuleInit {
  private ordersService: OrdersServiceClient;
  private usersService: UsersServiceClient;
  private cardsService: CardsServiceClient;

  constructor(
    @Inject(ORDERS_SERVICE_NAME) private ordersClient: ClientGrpc,
    @Inject(USERS_SERVICE_NAME) private usersClient: ClientGrpc,
    @Inject(CARDS_SERVICE_NAME) private cardsClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.ordersService =
      this.ordersClient.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME);

    this.usersService =
      this.usersClient.getService<UsersServiceClient>(USERS_SERVICE_NAME);

    this.cardsService =
      this.cardsClient.getService<CardsServiceClient>(CARDS_SERVICE_NAME);
  }

  async createOrder(createOrderRequest: CreateOrderRequest, jwtUserId: string) {
    const user = await this.usersService
      .getUser({ id: createOrderRequest.userId })
      .toPromise();
    if (user?.id !== jwtUserId) {
      throw new UnauthorizedException('you cannot acces this resource');
    }

    const card = await this.cardsService
      .getCard({ id: createOrderRequest.cardId })
      .toPromise();
    if (card?.userId !== jwtUserId) {
      throw new UnauthorizedException('you cannot acces this resource');
    }

    return this.ordersService.createOrder(createOrderRequest);
  }

  async getOrder(id: string, jwtUserId: string) {
    const order = await this.ordersService.getOrder({ id }).toPromise();
    if (order?.userId !== jwtUserId) {
      throw new UnauthorizedException('You cannot ccess this resource');
    }

    return order;
  }
}
