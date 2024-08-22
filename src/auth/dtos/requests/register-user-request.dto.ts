import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsArray, ArrayNotEmpty, ArrayMinSize } from 'class-validator';

export class RegisterUserRequestDto {
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongpassword', description: 'The password of the user' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: ['user'], description: 'Roles assigned to the user' })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  roles: string[];
}