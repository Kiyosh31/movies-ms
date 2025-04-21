import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EVENT_CREATE_PAYMENT } from '@app/common';
import { CreateChargeDto } from './dto/create-charge.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @EventPattern(EVENT_CREATE_PAYMENT)
  async createCharge(@Payload() data: CreateChargeDto) {
    return await this.paymentsService.createCharge(data);
  }
}
