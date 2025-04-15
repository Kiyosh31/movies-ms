import { CreateCardRequest } from '@app/common';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCardDto implements CreateCardRequest {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  cardName!: string;

  @IsNumber()
  @IsNotEmpty()
  number!: number;

  @IsNumber()
  @IsNotEmpty()
  expMonth!: number;

  @IsNumber()
  @IsNotEmpty()
  expYear!: number;

  @IsNumber()
  @IsNotEmpty()
  cvc!: number;

  @IsString()
  @IsNotEmpty()
  cardType: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
