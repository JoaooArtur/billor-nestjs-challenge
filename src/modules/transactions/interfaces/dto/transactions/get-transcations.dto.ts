import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf, IsOptional, IsDate } from 'class-validator';

export class GetTransactionsDto {

    @ApiProperty({
        description: 'The id of the wallet of the transactions',
        example: "2",
    })
    @ValidateIf((o) => !o.walletId)
    @IsNumber()
    @IsNotEmpty()
    walletId: number;

    @ApiProperty({
        description: 'The start date for the filters',
        example: "2025-01-01T23:59:59Z",
    })
    @ValidateIf((o) => o.endDate && o.startDate)
    @IsDate()
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({
        description: 'The end date for the filters',
        example: "2025-01-31T23:59:59Z",
    })
    @ValidateIf((o) => o.startDate && o.endDate)
    @IsDate()
    @IsNotEmpty()
    endDate: Date;
}