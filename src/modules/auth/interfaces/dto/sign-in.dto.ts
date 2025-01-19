import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
    
  @ApiProperty({
    description: 'The email of the user',
    example: "user@email.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @ApiProperty({
    description: 'The password of the user',
    example: "strongPASSWORD@!",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}