import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Roles } from 'src/modules/auth/domain/enumerations/roles.enum';

export class CreateUserDto {
  
  @ApiProperty({
    description: 'The name of the user',
    example: "User name 1",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: "user@email.com",
  })
  @IsEmail()
  email: string;
  
  @ApiProperty({
    description: 'The password of the user',
    example: "StrongPASSWORD@!",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
  
  @ApiProperty({
    description: 'The ROLE of the user',
    example: Roles.ADMIN,
  })
  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}