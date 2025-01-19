import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWalletDto {

  @ApiProperty({
    description: 'The name of the wallet',
    example: "Wallet name 1",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}