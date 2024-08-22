import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateOrderRequestDto {
  @ApiProperty({ description: 'A description of the order' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'The quantity of items in the order' }) 
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Quantity must be greater than zero' })
  quantity: number;

  @ApiProperty({ description: 'The price of the order' }) 
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'Price must be greater than zero' })
  price: number;
}