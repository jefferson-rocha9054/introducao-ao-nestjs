import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User name',
    example: 'John Doe'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'jonas@gmail.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    minLength: 6,
    example: 'password123'
  })
  @IsString()
  @MinLength(6)
  password: string;

}