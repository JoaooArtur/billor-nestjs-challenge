import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { TransactionType } from 'src/modules/transactions/domain/enumerations/transaction-type.enum';

export class CreateTransactionDto {
  
  @ApiProperty({
    description: 'The type of the transaction',
    example: TransactionType.TRANSFER,
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @ApiProperty({
    description: 'The amount of the transaction',
    example: "100",
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'The category of the transaction',
    example: "Ifood",
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'The id of the source wallet of the transaction, its only necessary in transfer or expense type',
    example: "2",
  })
  @ValidateIf((o) => !o.targetWalletId || o.type === TransactionType.TRANSFER || o.type === TransactionType.EXPENSE)
  @IsNumber()
  @IsNotEmpty()
  sourceWalletId: number;

  @ApiProperty({
    description: 'The id of the target wallet of the transaction, its only necessary in transfer or income type',
    example: "2",
  })
  @ValidateIf((o) => !o.sourceWalletId || o.type === TransactionType.TRANSFER || o.type === TransactionType.INCOME)
  @IsNumber()
  @IsNotEmpty()
  targetWalletId: number;
}