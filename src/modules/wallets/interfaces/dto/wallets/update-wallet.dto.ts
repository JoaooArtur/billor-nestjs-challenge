import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateWalletDto {
  
  @ApiProperty({
    description: 'The name of the wallet',
    example: "Wallet name 1",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}